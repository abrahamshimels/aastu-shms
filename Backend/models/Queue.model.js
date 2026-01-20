const dbhelper = require("../configs/dbhelper");
const {
  createTableQuery,
  addToQueueQuery,
  assignDoctorQuery,
  getActiveQueueQuery,
  getDoctorQueueQuery,
  completeQueueItemQuery,
} = require("../configs/queries/queue");

const createTable = () => {
  return dbhelper.query(createTableQuery, []).then((result) => {
    return result;
  });
};

const addToQueue = (student_id, chief_complaint, priority) => {
  return dbhelper.query(addToQueueQuery, [student_id, chief_complaint, priority]).then((result) => {
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
  createTable,
  addToQueue,
  assignDoctor,
  getActiveQueue,
  getDoctorQueue,
  completeQueueItem,
};
