const dbhelper = require("../configs/dbhelper");
const { 
  createTableQuery, 
  addToQueueQuery, 
  assignDoctorQuery, 
  getActiveQueueQuery, 
  getDoctorQueueQuery,
  completeQueueItemQuery,
  deleteQueueItemQuery,
  updateQueueItemQuery,
  checkActiveInQueueQuery
} = require("../configs/queries/queue");

const initialize = async () => {
  try {
    await dbhelper.query(createTableQuery);

    // Keep existing DBs compatible: migrate queue.doctor_id FK from doctors(id) to staff(id)
    await dbhelper.query(`ALTER TABLE queue DROP CONSTRAINT IF EXISTS queue_doctor_id_fkey;`);
    await dbhelper.query(`
      UPDATE queue q
      SET doctor_id = NULL
      WHERE doctor_id IS NOT NULL
        AND NOT EXISTS (
          SELECT 1
          FROM staff s
          WHERE s.id = q.doctor_id
            AND s.role = 'DOCTOR'
        );
    `);
    await dbhelper.query(`
      ALTER TABLE queue
      ADD CONSTRAINT queue_doctor_id_fkey
      FOREIGN KEY (doctor_id) REFERENCES staff(id)
      ON UPDATE CASCADE
      ON DELETE SET NULL;
    `);

    console.log("✅ Queue table initialized successfully.");
  } catch (err) {
    console.error("❌ Failed to initialize Queue table:", err.message);
  }
};

const getPublicQueue = async () => {
  // Use getActiveQueueQuery for public queue display
  return await dbhelper.query(getActiveQueueQuery);
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

const addToQueue = (student_id, chief_complaint, priority, doctor_id = null) => {
  const status = doctor_id ? 'Assigned' : 'Checked-In';
  return dbhelper.query(addToQueueQuery, [student_id, chief_complaint, priority, doctor_id, status]).then((result) => {
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

const deleteQueueItem = (id) => {
  return dbhelper.query(deleteQueueItemQuery, [id]).then((result) => {
    return result;
  });
};

const updateQueueItem = (id, chief_complaint, priority) => {
  return dbhelper.query(updateQueueItemQuery, [chief_complaint, priority, id]).then((result) => {
    return result;
  });
};

const checkActiveInQueue = (student_id) => {
  return dbhelper.query(checkActiveInQueueQuery, [student_id]).then((result) => {
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
  deleteQueueItem,
  updateQueueItem,
  checkActiveInQueue,
};
