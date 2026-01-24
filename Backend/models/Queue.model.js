const dbhelper = require("../configs/dbhelper");
const { 
  createTableQuery, 
  addToQueueQuery, 
  assignDoctorQuery, 
  getActiveQueueQuery, 
  getDoctorQueueQuery, 
  completeQueueItemQuery 
} = require("../configs/queries/queue");

const initialize = async () => {
  try {
    await dbhelper.query(createTableQuery);
    console.log("✅ Queue table initialized successfully.");
  } catch (err) {
    console.error("❌ Failed to initialize Queue table:", err.message);
  }
};

const getPublicQueue = async () => {
  // Use getActiveQueueQuery for public queue display
  return await dbhelper.query(getActiveQueueQuery);
};

const addToQueue = async (student_id, chief_complaint, priority) => {
  // This supports both positional arguments and object arguments if needed
  if (typeof student_id === 'object') {
    const { student_id: sid, chief_complaint: cc, priority: p } = student_id;
    return await dbhelper.query(addToQueueQuery, [sid, cc, p]);
  }
  return await dbhelper.query(addToQueueQuery, [student_id, chief_complaint, priority]);
};

const createTable = () => {
  return dbhelper.query(createTableQuery, []).then((result) => {
    return result;
  });
};

const assignDoctor = (doctor_id, id) => {
  return dbhelper.query(assignDoctorQuery, [doctor_id, id]).then((result) => {
    return result;
  });
};

const getActiveQueue = () => {
  return dbhelper.query(getActiveQueueQuery).then((result) => {
    return result;
  });
};

const getDoctorQueue = (doctor_id) => {
  return dbhelper.query(getDoctorQueueQuery, [doctor_id]).then((result) => {
    return result;
  });
};

const completeQueueItem = (id) => {
  return dbhelper.query(completeQueueItemQuery, [id]).then((result) => {
    return result;
  });
};

module.exports = {
  initialize,
  getPublicQueue,
  addToQueue,
  createTable,
  assignDoctor,
  getActiveQueue,
  getDoctorQueue,
  completeQueueItem,
};
