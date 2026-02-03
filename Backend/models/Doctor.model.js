const dbhelper = require("../configs/dbhelper");
const {
  createDoctorsTable,
  addDoctorQuery,
  findDoctorByEmailQuery,
  getAllDoctorsQuery,
  updateDoctorQuery,
} = require("../configs/queries/doctors");

const DoctorModel = {
  createTables: async () => {
    try {
      await dbhelper.query(createDoctorsTable);
      console.log('Doctors table initialized');
    } catch (err) {
      console.error('Error initializing Doctors table:', err.message);
    }
  },

  addDoctor: async (doctor) => {
    const values = [
      doctor.name,
      doctor.phonenum,
      doctor.email,
      doctor.password || 'Doctor@123',
      doctor.age,
      doctor.gender,
      doctor.bloodgroup,
      doctor.dob,
      doctor.address,
      doctor.education,
      doctor.department,
      doctor.fees
    ];
    return await dbhelper.query(addDoctorQuery, values);
  },

  updateDoctor: async (email, doctor) => {
    const values = [
      email,
      doctor.name,
      doctor.phonenum,
      doctor.age,
      doctor.gender,
      doctor.bloodgroup,
      doctor.dob,
      doctor.address,
      doctor.education,
      doctor.department,
      doctor.fees
    ];
    return await dbhelper.query(updateDoctorQuery, values);
  },

  getDoctorCredFromEmail: async (email) => {
    const result = await dbhelper.query(findDoctorByEmailQuery, [email]);
    return result;
  },

  getAllDoctors: async () => {
    return await dbhelper.query(getAllDoctorsQuery);
  }
};

module.exports = DoctorModel;
