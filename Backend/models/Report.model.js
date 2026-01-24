const dbhelper = require("../configs/dbhelper");
const {
  createReportsTable,
  createReportQuery: createReportQueryNew,
  getAllReportsQuery: getAllReportsQueryNew,
  getReportsByUserQuery,
} = require("../configs/queries/reports");

const {
  getLastReportIdQuery,
  countReportQuery,
  createReportQuery,
  getDoctorReportQuery,
  getPatientReportQuery,
  getAllReportsQuery,
  createReportTableQuery,
} = require("../configs/queries/report");

const initialize = async () => {
  try {
    await dbhelper.query(createReportsTable);
    console.log("✅ Reports table initialized successfully.");
  } catch (err) {
    console.error("❌ Failed to initialize Reports table:", err.message);
  }
};

const createReport = async (reportData) => {
  const values = [
    reportData.patient_id || reportData.patientid,
    reportData.doctor_id || reportData.doctorid,
    reportData.appointment_id || null,
    reportData.date,
    reportData.time,
    reportData.disease,
    reportData.temperature,
    reportData.weight,
    reportData.bp,
    reportData.glucose,
    reportData.info,
    JSON.stringify(reportData.medicines || []),
  ];
  const result = await dbhelper.query(createReportQueryNew, values);
  return result[0];
};

const getAllReports = async () => {
  return dbhelper.query(getAllReportsQueryNew);
};

const getReportsByUser = async (userId) => {
  return dbhelper.query(getReportsByUserQuery, [userId]);
};

const createTables = () => {
  return dbhelper.query(createReportTableQuery, []).then((result) => {
    return result;
  });
};

const countReport = () => {
  return dbhelper.query(countReportQuery, []).then((result) => {
    return result[0];
  });
};

const getLastReportId = () => {
  return dbhelper.query(getLastReportIdQuery, []).then((result) => {
    return result[0];
  });
};

const getDoctorReports = (id) => {
  return dbhelper.query(getDoctorReportQuery, [id]).then((result) => {
    return result;
  });
};

const getPatientReports = (id) => {
  return dbhelper.query(getPatientReportQuery, [id]).then((result) => {
    return result;
  });
};

const getAllReportsLegacy = () => {
  return dbhelper.query(getAllReportsQuery, []).then((result) => {
    return result;
  });
};

module.exports = {
  initialize,
  createReport,
  getAllReports,
  getReportsByUser,
  createTables,
  countReport,
  getLastReportId,
  getDoctorReports,
  getPatientReports,
  getAllReportsLegacy,
};
