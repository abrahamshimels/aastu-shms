const express = require("express");
const {
  createTables,
  findCred,
  addNurse,
  findIfExists,
  getNurseCredsFromEmail,
  getAllNurses,
  updatePass
} = require("../models/Nurses.model");
const {
  addPatient,
  findByStudentID,
  updatePhone
} = require("../models/Patient.model");
const {
  addToQueue,
  assignDoctor,
  getActiveQueue,
  deleteQueueItem,
  updateQueueItem,
  checkActiveInQueue
} = require("../models/Queue.model");
const { getAllDoctors } = require("../models/Doctor.model");

require("dotenv").config();
const jwt = require("jsonwebtoken");
const router = express.Router();

// Nurse Login
router.post("/login", async (req, res) => {
  const { nurseID, password } = req.body;
  try {
    const nurse = await findCred(nurseID);
    if (
      nurse.length > 0 &&
      nurseID == nurse[0].id &&
      password == nurse[0].password
    ) {
      const token = jwt.sign({ foo: "bar" }, process.env.KEY, {
        expiresIn: "24h",
      });
      res.send({
        message: "Successful",
        user: { ...nurse[0], userType: "nurse" },
        token: token,
      });
    } else {
      res.send({ message: "Wrong credentials" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Error during login" });
  }
});

// Student/Patient Registration
router.post("/register-patient", async (req, res) => {
  try {
    const existing = await findByStudentID(req.body.studentID);
    if (existing && existing.length > 0) {
      return res.send({ message: "Student already registered" });
    }
    // Set a default password for students if not provided
    if (!req.body.password) {
      req.body.password = "Student@123";
    }
    await addPatient(req.body);
    res.send({ message: "Registered" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Error during student registration" });
  }
});

router.get("/patient", async (req, res) => {
  try {
    const { studentID } = req.query;
    console.log("Searching for studentID:", studentID);
    const student = await findByStudentID(studentID);
    if (student && student.length > 0) {
      res.send(student[0]);
    } else {
      res.status(404).send({ message: "Student not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Error searching student" });
  }
});

// Update Phone Number
router.patch("/patient/phone", async (req, res) => {
  try {
    const { studentID, phoneNum } = req.body;
    await updatePhone(phoneNum, studentID);
    res.send({ message: "Phone number updated" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Error updating phone number" });
  }
});



// Queue Management - Check-In
router.post("/check-in", async (req, res) => {
  const { student_id, chief_complaint, priority, doctor_id } = req.body;
  try {
    // Check if already in queue (not completed)
    const active = await checkActiveInQueue(student_id);
    if (active && active.length > 0) {
      return res.status(400).send({ message: "Patient is already in the queue" });
    }

    const result = await addToQueue(student_id, chief_complaint, priority, doctor_id);
    res.send({ message: "Checked-in", data: result[0] });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Error checking-in student" });
  }
});

// Queue Management - Get All Active Queue
router.get("/queue", async (req, res) => {
  try {
    const queue = await getActiveQueue();
    res.send(queue);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Error fetching queue" });
  }
});

// Queue Management - Unassign Doctor
router.patch("/unassign-doctor", async (req, res) => {
  const { queue_id } = req.body;
  try {
    // Re-using addToQueue which sets status based on doctor_id presence
    // We update doctor_id to NULL and status to Checked-In
    const result = await assignDoctor(null, queue_id);
    // Since assignDoctor sets status to 'Assigned', we need to check if doctor_id is null in the query or update the query
    // Let's modify the query in queue.js actually, or perform a custom update here
    const dbhelper = require("../configs/dbhelper");
    await dbhelper.query(`UPDATE queue SET doctor_id = NULL, status = 'Checked-In' WHERE id = $1`, [queue_id]);
    res.send({ message: "Doctor unassigned" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Error unassigning doctor" });
  }
});

// Queue Management - Assign Doctor
router.patch("/assign-doctor", async (req, res) => {
  const { doctor_id, queue_id } = req.body;
  try {
    const result = await assignDoctor(doctor_id, queue_id);
    res.send({ message: "Doctor assigned", data: result[0] });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Error assigning doctor" });
  }
});



// Queue Management - Delete/Remove from Queue
router.delete("/queue/:id", async (req, res) => {
  try {
    await deleteQueueItem(req.params.id);
    res.send({ message: "Removed from queue" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Error removing from queue" });
  }
});



// Queue Management - Update Queue Item
router.patch("/queue/:id", async (req, res) => {
  const { chief_complaint, priority } = req.body;
  try {
    await updateQueueItem(req.params.id, chief_complaint, priority);
    res.send({ message: "Updated" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Error updating queue" });
  }
});

// Available Doctors for Assignment
router.get("/doctors", async (req, res) => {
  try {
    const doctors = await getAllDoctors();
    res.send(doctors);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Error fetching doctors" });
  }
});

// Appointment Scheduling
const { createAppointment, getAllAppointments } = require("../models/Appointment.model");

router.post("/appointments", async (req, res) => {
  try {
    const result = await createAppointment(req.body);
    res.send({ message: "Appointment scheduled successfully", data: result });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Error scheduling appointment" });
  }
});

router.get("/appointments", async (req, res) => {
  try {
    const appointments = await getAllAppointments();
    res.send(appointments);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Error fetching appointments" });
  }
});

const { deleteAppointment, updateAppointment } = require("../models/Appointment.model");

router.delete("/appointments/:id", async (req, res) => {
  try {
    await deleteAppointment(req.params.id);
    res.send({ message: "Appointment deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Error deleting appointment" });
  }
});

router.patch("/appointments/:id", async (req, res) => {
  try {
    await updateAppointment(req.params.id, req.body);
    res.send({ message: "Appointment updated" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Error updating appointment" });
  }
});

// Get Certificate Config
const { getConfig } = require("../models/Config.model");
router.get("/config/certificate_settings", async (req, res) => {
  try {
    const config = await getConfig("certificate_settings");
    res.send(config ? JSON.parse(config) : null);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Error fetching certificate config" });
  }
});

module.exports = router;
