const dbhelper = require("../configs/dbhelper");
const {
  createDoctorsTable,
  addDoctorQuery,
  findDoctorByEmailQuery,
  getAllDoctorsQuery,
  updateDoctorQuery,
  findDoctorByIdQuery,
  updateDoctorByIdQuery,
  updateDoctorPasswordQuery,
  updateDoctorAvailabilityQuery,
} = require("../configs/queries/doctors");

const createTables = async () => {
  try {
    await dbhelper.query(createDoctorsTable);
    console.log("Doctors table initialized");
  } catch (err) {
    console.error("Error initializing Doctors table:", err.message);
  }
};

const getAllDoctors = async () => {
  return await dbhelper.query(getAllDoctorsQuery);
};

const findById = async (id) => {
  return dbhelper.query(findDoctorByIdQuery, [id]).then((result) => result);
};

const findIfExists = async (email) => {
  return dbhelper
    .query(findDoctorByEmailQuery, [email])
    .then((result) => result);
};

const addDoctor = async (doctor) => {
  // Map input fields flexibly (support different key naming from seeds/clients)
  // ensure an id exists (generate simple id if not provided)
  const id = doctor.id || `doc_${Date.now()}`;

  const values = [
    id,
    doctor.name,
    doctor.phonenum || doctor.phoneNum || doctor.phone || null,
    doctor.email,
    doctor.password || "Doctor@123",
    doctor.age,
    doctor.gender,
    doctor.bloodgroup || doctor.bloodGroup || null,
    doctor.dob || doctor.DOB || null,
    doctor.address,
    doctor.education,
    doctor.department,
    doctor.fees,
  ];

  const result = await dbhelper.query(addDoctorQuery, values);
  return result[0];
};

const updatePass = async (password, id) => {
  const result = await dbhelper.query(updateDoctorPasswordQuery, [
    id,
    password,
  ]);
  return result[0];
};

const addAvailableTimes = async (id, times) => {
  const result = await dbhelper.query(updateDoctorAvailabilityQuery, [
    id,
    times,
  ]);
  return result[0];
};

const updateDoctorById = async (id, doctor) => {
  const values = [
    id,
    doctor.name,
    doctor.phonenum,
    doctor.age,
    doctor.gender,
    doctor.bloodgroup,
    doctor.dob,
    doctor.address,
    doctor.education,
    doctor.department,
    doctor.fees,
  ];
  const result = await dbhelper.query(updateDoctorByIdQuery, values);
  return result[0];
};

const getDoctorCredFromEmail = async (email) => {
  return dbhelper
    .query(findDoctorByEmailQuery, [email])
    .then((result) => result);
};

module.exports = {
  createTables,
  getAllDoctors,
  findById,
  findIfExists,
  addDoctor,
  updatePass,
  addAvailableTimes,
  updateDoctorById,
  getDoctorCredFromEmail,
};
