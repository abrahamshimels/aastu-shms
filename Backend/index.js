const express = require("express");
require("dotenv").config();
const cors = require("cors");
const authRouter = require("./routes/Auth.Route");
const adminRouter = require("./routes/Admin.Route");
const publicRouter = require("./routes/Public.Route");
const reportRouter = require("./routes/Report.Route");

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

  } catch (err) {
    console.error("Error connecting to the database:", err.message);
  }
  console.log(`Listening at port ${process.env.PORT || 3007}`);
});
