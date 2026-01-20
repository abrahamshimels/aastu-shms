const dbhelper = require("../configs/dbhelper");
const {
  createReportsTable,
  createReportQuery,
  getAllReportsQuery,
  getReportsByUserQuery,
} = require("../configs/queries/reports");

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
    reportData.patient_id,
    reportData.doctor_id,
    reportData.appointment_id,
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
  const result = await dbhelper.query(createReportQuery, values);
  return result[0];
};

const getAllReports = async () => {
  return dbhelper.query(getAllReportsQuery);
};

const getReportsByUser = async (userId) => {
  return dbhelper.query(getReportsByUserQuery, [userId]);
};

module.exports = {
  initialize,
  createReport,
  getAllReports,
  getReportsByUser,
  countReportQuery,
  createReportQuery,
  getLastReportIdQuery,
  getDoctorReportQuery,
  getPatientReportQuery,
  getAllReportsQuery,
  createReportTableQuery,
} = require("../configs/queries/report");

const createTables = () => {
  return dbhelper.query(createReportTableQuery, []).then((result) => {
    return result;
  });
};

const countReport = () => {
  console.log(countReportQuery);
  return dbhelper.query(countReportQuery, []).then((result) => {
    console.log(result, "in db helper");
    return result[0];
  });
};

const createReport = (data) => {
  const array = Object.values(data);
  return dbhelper.query(createReportQuery, array).then((result) => {
    console.log(result, "in db helper");
    return result[0];
  });
};

const getLastReportId = () => {
  return dbhelper.query(getLastReportIdQuery, []).then((result) => {
    console.log(result, "in db helper");
    return result[0];
  });
};

const getDoctorReports = (id) => {
  return dbhelper.query(getDoctorReportQuery, [id]).then((result) => {
    // console.log(result, "in db helper");
    return result;
  });
};

const getPatientReports = (id) => {
  return dbhelper.query(getPatientReportQuery, [id]).then((result) => {
    //console.log(result, "in db helper");
    return result;
  });
};

const getAllReports = () => {
  return dbhelper.query(getAllReportsQuery, []).then((result) => {
    return result;
  });
};

module.exports = {
  createTables,
  countReport,
  createReport,
  getLastReportId,
  getDoctorReports,
  getPatientReports,
  getAllReports,
};
