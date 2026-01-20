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
};
