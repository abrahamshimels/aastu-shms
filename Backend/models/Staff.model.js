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

const initialize = async () => {
  try {
    await dbhelper.query(createStaffTable);
    console.log("✅ Staff table initialized successfully.");
  } catch (err) {
    console.error("❌ Failed to initialize Staff table:", err.message);
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
    staff.qualification,
  ];
  const result = await dbhelper.query(addStaffQuery, values);
  return result[0];
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
  ];
  const result = await dbhelper.query(updateStaffQuery, values);
  return result[0];
};

module.exports = {
  initialize,
  addStaff,
  findByEmail,
  findById,
  getAllStaff,
  updateStaff,
  updatePassword,
};
