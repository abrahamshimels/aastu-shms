const express = require("express");
require("dotenv").config();
const cors = require("cors");
const adminRouter = require("./routes/Admins.Route");
const ambulanceRouter = require("./routes/Ambulances.Route");
const appointmentRouter = require("./routes/Appointments.Route");
const doctorRouter = require("./routes/Doctors.Route");
const hospitalRouter = require("./routes/Hospitals.Route");
const patientRouter = require("./routes/Patients.Route");
const prescriptionRouter = require("./routes/Prescriptions.Route");
const reportRouter = require("./routes/Reports.Route");
const labTechRouter = require("./routes/LabTechnologist.Route");
const labRouter = require("./routes/Lab.Route");

const app = express();
const db = require("./configs/db");
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Healthcare System");
});

app.use("/admin", adminRouter);
app.use("/ambulances", ambulanceRouter);
app.use("/appointments", appointmentRouter);
app.use("/doctors", doctorRouter);
app.use("/hospitals", hospitalRouter);
app.use("/patients", patientRouter);
app.use("/prescriptions", prescriptionRouter);
app.use("/reports", reportRouter);
app.use("/labtechs", labTechRouter);
app.use("/lab", labRouter);

// Import table creation functions
const { createTables: createAdminTables } = require("./models/Admin.model");
const { createTables: createDoctorTables } = require("./models/Doctor.model");
const { createTable: createPatientTable } = require("./models/Patient.model");
const { createTable: createAmbulanceTable } = require("./models/Ambulance.model");
const { createTables: createLabTechTables } = require("./models/LabTechnologist.model");
const { createTables: createLabTables } = require("./models/Lab.model");
const { createTable: createAppointmentTable } = require("./models/Appointment.model");
const { createTables: createReportTable } = require("./models/Report.model");

app.listen(process.env.PORT || 3007, async () => {
  try {
    const result = await db.query("SELECT NOW()");
    console.log("Connected to the database at", result.rows[0].now);
    console.log("Connected to DB successfully");

    // Initialize tables
    await createAdminTables();
    await createDoctorTables();
    await createPatientTable();
    await createAmbulanceTable();
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
