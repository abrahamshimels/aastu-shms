const express = require("express");
const router = express.Router();
const { createReport, getAllReports, getReportsByUser } = require("../models/Report.model");
const { authenticate, authorize } = require("../middlewares/authMiddleware");
const { logAction } = require("../models/AuditLog.model");

// All routes require authentication
router.use(authenticate);

/**
 * @route   POST /reports
 * @desc    Create a new clinical report
 * @access  DOCTOR, ADMIN
 */
router.post("/", authorize(["DOCTOR", "ADMIN"]), async (req, res) => {
  try {
    const report = await createReport({
      ...req.body,
      doctor_id: req.body.doctorid || req.user.id, // Support frontend field names
      patient_id: req.body.patientid,
      appointment_id: req.body.appointmentid,
    });

    await logAction(req.user.id, "CREATE_REPORT", "reports", report.id);

    res.status(201).json({ message: "successful", report });
  } catch (err) {
    console.error("Report creation error:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

/**
 * @route   GET /reports
 * @desc    Get all reports (Admin only)
 */
router.get("/", authorize(["ADMIN"]), async (req, res) => {
  try {
    const reports = await getAllReports();
    res.status(200).json({ data: reports });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
});

/**
 * @route   GET /reports/:userType/:id
 * @desc    Get reports for a specific user (Doctor/Patient)
 */
router.get("/:userType/:id", authorize(["DOCTOR", "ADMIN", "PATIENT"]), async (req, res) => {
  try {
    const reports = await getReportsByUser(req.params.id);
    res.status(200).json({ data: reports });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
