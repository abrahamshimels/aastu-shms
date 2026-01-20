const express = require("express");
const {
  createTables,
  findCred,
  addNurse,
  findIfExists,
  getNurseCredsFromEmail,
  getAllNurses,
  updatePass
} = require("../models/Nurse.model");
const {
  addPatient,
  findByStudentID,
  updatePhone
} = require("../models/Patient.model");
const {
  addToQueue,
  assignDoctor,
  getActiveQueue
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

// Student Registration
router.post("/register-student", async (req, res) => {
  try {
    const existing = await findByStudentID(req.body.studentID);
    if (existing.length > 0) {
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

router.get("/student", async (req, res) => {
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
router.patch("/student/phone", async (req, res) => {
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
  const { student_id, chief_complaint, priority } = req.body;
  try {
    const result = await addToQueue(student_id, chief_complaint, priority);
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

module.exports = router;
