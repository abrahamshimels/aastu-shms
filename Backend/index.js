const express = require("express");
require("dotenv").config();
const cors = require("cors");
const authRouter = require("./routes/Auth.Route");
const adminRouter = require("./routes/Admin.Route");
const publicRouter = require("./routes/Public.Route");
const reportRouter = require("./routes/Report.Route");
// const ambulanceRouter = require("./routes/Ambulances.Route");
const appointmentRouter = require("./routes/Appointments.Route");
const doctorRouter = require("./routes/Doctors.Route");
// const hospitalRouter = require("./routes/Hospitals.Route");
const patientRouter = require("./routes/Patients.Route");
// const prescriptionRouter = require("./routes/Prescriptions.Route");
const reportRouter = require("./routes/Reports.Route");
const nurseRouter = require("./routes/Nurses.Route");
const certificateRouter = require("./routes/Certificates.Route");
const labTechRouter = require("./routes/LabTechnologist.Route");
const labRouter = require("./routes/Lab.Route");

const app = express();
const db = require("./configs/db");
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("SHMS Backend - Centralized Auth Active");
});

// Centralized Routes
app.use("/auth", authRouter);
app.use("/admin", adminRouter);
app.use("/public", publicRouter);
app.use("/reports", reportRouter);

// Table Initializers
const { initialize: initializeStaffTable } = require("./models/Staff.model");
const { initialize: initializeAuditLogsTable } = require("./models/AuditLog.model");
const { initialize: initializeConfigTable } = require("./models/Config.model");
const { initialize: initializeQueueTable } = require("./models/Queue.model");
const { initialize: initializeReportsTable } = require("./models/Report.model");
// app.use("/ambulances", ambulanceRouter);
app.use("/appointments", appointmentRouter);
app.use("/doctors", doctorRouter);
// app.use("/hospitals", hospitalRouter);
app.use("/patients", patientRouter);
// app.use("/prescriptions", prescriptionRouter);
app.use("/reports", reportRouter);
app.use("/nurses", nurseRouter);
app.use("/certificates", certificateRouter);
app.use("/labtechs", labTechRouter);
app.use("/lab", labRouter);

// Import table creation functions
// const { createTables: createAdminTables } = require("./models/Admin.model");
const { createTables: createDoctorTables } = require("./models/Doctor.model");
const { createTable: createPatientTable } = require("./models/Patient.model");
// const { createTable: createAmbulanceTable } = require("./models/Ambulance.model");
const { createTables: createNurseTables } = require("./models/Nurse.model");
const { createTable: createQueueTable } = require("./models/Queue.model");
const { createTables: createLabTechTables } = require("./models/LabTechnologist.model");
const { createTables: createLabTables } = require("./models/Lab.model");
const { createTable: createAppointmentTable } = require("./models/Appointment.model");
const { createTables: createReportTable } = require("./models/Report.model");

app.listen(process.env.PORT || 3007, async () => {
  try {
    const result = await db.query("SELECT NOW()");
    console.log("Connected to the database at", result.rows[0].now);
    console.log("Connected to DB successfully");

    // Initialize only the core tables
    await initializeStaffTable();
    await initializeAuditLogsTable();
    await initializeConfigTable();
    await initializeQueueTable();
    await initializeReportsTable();
    console.log("SHMS tables initialized successfully");
    // Initialize tables
    // await createAdminTables();
    await createDoctorTables();
    await createPatientTable();
    // await createAmbulanceTable();
    await createNurseTables();
    await createQueueTable();
    await createLabTechTables();
    await createLabTables();
    await createAppointmentTable();
    await createReportTable();
    console.log("All tables initialized successfully");

  } catch (err) {
    console.error("Error connecting to the database:", err.message);
  }
  console.log(`Listening at port ${process.env.PORT || 3007}`);
});
