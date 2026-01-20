const dbhelper = require("../configs/dbhelper");
const { createQueueTable, getPublicQueueQuery, addToQueueQuery } = require("../configs/queries/queue");

const initialize = async () => {
  try {
    await dbhelper.query(createQueueTable);
    console.log("✅ Queue table initialized successfully.");
  } catch (err) {
    console.error("❌ Failed to initialize Queue table:", err.message);
  }
};

const getPublicQueue = async () => {
  return await dbhelper.query(getPublicQueueQuery);
};

const addToQueue = async (patientData) => {
  const { patient_name, department, status, wait_time } = patientData;
  return await dbhelper.query(addToQueueQuery, [
    patient_name,
    department,
    status || 'Waiting',
    wait_time || '10-20 mins'
  ]);
};

module.exports = {
  initialize,
  getPublicQueue,
  addToQueue
};
