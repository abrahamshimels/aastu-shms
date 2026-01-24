const dbhelper = require("../configs/dbhelper");
const {
  createStaffTable,
  addStaffQuery,
  findByEmailQuery,
  findByIdQuery,
  getAllStaffQuery,
  updateStaffQuery,
  countStaffByRoleQuery,
  updatePasswordQuery,
} = require("../configs/queries/staff");
const DoctorsModel = require("./Doctors.model");
const PatientsModel = require("./Patients.model");
const NursesModel = require("./Nurses.model");
const LabTechModel = require("./LabTechnologist.model");

const initialize = async () => {
  try {
    await dbhelper.query(createStaffTable);
    console.log("✅ Staff table initialized successfully.");
    await DoctorsModel.init();
    await PatientsModel.init();
    await NursesModel.init();
    await LabTechModel.createTables();
  } catch (err) {
    console.error("❌ Failed to initialize database tables:", err.message);
  }
};

const addStaff = async (staff) => {
  // Generate ID if not provided
  if (!staff.id) {
    const rolePrefixes = {
      ADMIN: "ADM",
      NURSE: "NRS",
      DOCTOR: "DOC",
      LAB_TECH: "LAB",
    };
    const countResult = await dbhelper.query(countStaffByRoleQuery, [staff.role]);
    const row = countResult[0];
    const count = row && row.count ? parseInt(row.count) : 0;
    const prefix = rolePrefixes[staff.role] || "STF";
    staff.id = `${prefix}-${(count + 1).toString().padStart(3, "0")}`;
    console.log(`Generated ID: ${staff.id} for role: ${staff.role}`);
  }

  const values = [
    staff.id,
    staff.name,
    staff.email,
    staff.password_hash,
    staff.role,
    staff.qualification || null,
    staff.phonenum || null,
    staff.dob || null,
    staff.gender || null,
    staff.age || null,
    staff.address || null,
  ];
  const result = await dbhelper.query(addStaffQuery, values);
  const newStaff = result[0];

  // DUAL-WRITE SYNC
  if (newStaff.role === "DOCTOR") {
    try {
      await DoctorsModel.addDoctor({
        name: staff.name,
        phonenum: staff.phonenum || 0,
        email: staff.email,
        password: staff.password || "Doctor@123",
        age: staff.age || 0,
        gender: staff.gender || "M",
        bloodgroup: staff.bloodgroup || "N/A",
        dob: staff.dob || new Date().toISOString().split("T")[0],
        address: staff.address || "AASTU",
        education: staff.qualification || "MD",
        department: staff.department || "General",
        fees: staff.fees || 0,
      });
      console.log(`✅ Synced DOCTOR ${newStaff.id} to independent doctors table.`);
    } catch (syncErr) {
      console.error(`❌ Sync failed for DOCTOR ${newStaff.id}:`, syncErr.message);
    }
  } else if (newStaff.role === "NURSE") {
    try {
      await NursesModel.addNurse({
        name: staff.name,
        phonenum: staff.phonenum || 0,
        email: staff.email,
        password: staff.password || "Nurse@123",
        age: staff.age || 0,
        gender: staff.gender || "M",
        address: staff.address || "AASTU",
        qualification: staff.qualification || "BSc"
      });
      console.log(`✅ Synced NURSE ${newStaff.id} to independent nurses table.`);
    } catch (syncErr) {
      console.error(`❌ Sync failed for NURSE ${newStaff.id}:`, syncErr.message);
    }
  } else if (newStaff.role === "LAB_TECH") {
    try {
      await LabTechModel.addLabTech({
        name: staff.name,
        phonenum: staff.phonenum || 0,
        email: staff.email,
        password: staff.password || "Lab@123",
        age: staff.age || 0,
        gender: staff.gender || "M",
        dob: staff.dob || new Date().toISOString().split("T")[0],
        address: staff.address || "AASTU",
      });
      console.log(`✅ Synced LAB_TECH ${newStaff.id} to independent lab tech table.`);
    } catch (syncErr) {
      console.error(`❌ Sync failed for LAB_TECH ${newStaff.id}:`, syncErr.message);
    }
  }

  return newStaff;
};

const updatePassword = async (id, password_hash) => {
  return dbhelper.query(updatePasswordQuery, [id, password_hash]);
};

const findByEmail = async (email) => {
  const result = await dbhelper.query(findByEmailQuery, [email]);
  return result[0];
};

const findById = async (id) => {
  const result = await dbhelper.query(findByIdQuery, [id]);
  return result[0];
};

const getAllStaff = async () => {
  return dbhelper.query(getAllStaffQuery);
};

const updateStaff = async (id, staff) => {
  const values = [
    id,
    staff.name,
    staff.email,
    staff.role,
    staff.qualification,
    staff.is_active,
    staff.phonenum || null,
    staff.dob || null,
    staff.gender || null,
    staff.age || null,
    staff.address || null,
  ];
  const result = await dbhelper.query(updateStaffQuery, values);
  const updatedStaff = result[0];

  // UPDATE SYNC
  if (updatedStaff) {
    if (updatedStaff.role === "DOCTOR") {
      try {
        await DoctorsModel.updateDoctor(updatedStaff.email, {
          name: updatedStaff.name,
          phonenum: updatedStaff.phonenum || 0,
          age: updatedStaff.age || 0,
          gender: updatedStaff.gender || "M",
          bloodgroup: staff.bloodgroup || "N/A", // Use input object 'staff' for fields not in 'updatedStaff' return
          dob: updatedStaff.dob,
          address: updatedStaff.address,
          education: updatedStaff.qualification,
          department: staff.department || "General",
          fees: staff.fees || 0,
        });
        console.log(`✅ Synced update for DOCTOR ${id} to independent doctors table.`);
      } catch (syncErr) {
        console.error(`❌ Update sync failed for DOCTOR ${id}:`, syncErr.message);
      }
    } else if (updatedStaff.role === "NURSE") {
      try {
        await NursesModel.updateNurse(updatedStaff.email, {
          name: updatedStaff.name,
          phonenum: updatedStaff.phonenum || 0,
          age: updatedStaff.age || 0,
          gender: updatedStaff.gender || "M",
          address: updatedStaff.address,
          qualification: updatedStaff.qualification
        });
        console.log(`✅ Synced update for NURSE ${id} to independent nurses table.`);
      } catch (syncErr) {
        console.error(`❌ Update sync failed for NURSE ${id}:`, syncErr.message);
      }
    }
  }

  return updatedStaff;
};

const updateLastLogin = async (id) => {
  console.log(`DB Update: Setting last_login for ${id}`);
  return dbhelper.query(`UPDATE staff SET last_login = CURRENT_TIMESTAMP WHERE id = $1`, [id]);
};

module.exports = {
  initialize,
  addStaff,
  findByEmail,
  findById,
  getAllStaff,
  updateStaff,
  updatePassword,
  updateLastLogin,
};
