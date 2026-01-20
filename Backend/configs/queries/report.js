const createReportTableQuery = `CREATE TABLE IF NOT EXISTS reports (
  id SERIAL PRIMARY KEY,
  patientid INT NOT NULL,
  doctorid INT NOT NULL,
  date DATE NOT NULL,
  time TIME NOT NULL,
  disease TEXT,
  temperature VARCHAR(20),
  weight VARCHAR(20),
  bp VARCHAR(20),
  glucose VARCHAR(20),
  info TEXT,
  FOREIGN KEY (patientid) REFERENCES patients(id),
  FOREIGN KEY (doctorid) REFERENCES doctors(id)
);`;

const countReportQuery = `SELECT COUNT(*) FROM reports;`;

const createReportQuery = `INSERT INTO reports (
    patientid,
    doctorid,
    date,
    time,
    disease,
    temperature,
    weight,
    bp,
    glucose,
    info
  )
VALUES (
    $1, $2, $3, $4, $5, $6, $7, $8, $9, $10
  )`;

const getLastReportIdQuery = `SELECT id
from reports
ORDER BY id DESC
LIMIT 1;`;

const getPatientReportQuery = `SELECT doctors.name,
reports.*
FROM reports
JOIN doctors ON reports.doctorid = doctors.id
WHERE reports.patientid = $1;`;

const getDoctorReportQuery = `SELECT patients.name,
reports.*
FROM reports
JOIN patients ON reports.patientid = patients.id
WHERE reports.doctorid = $1;`;

const getAllReportsQuery = `SELECT patients.name as patient_name, doctors.name as doctor_name,
reports.*
FROM reports
JOIN patients ON reports.patientid = patients.id
JOIN doctors ON reports.doctorid = doctors.id;`;

module.exports = {
  getLastReportIdQuery,
  countReportQuery,
  createReportQuery,
  getDoctorReportQuery,
  getPatientReportQuery,
  getAllReportsQuery,
  createReportTableQuery,
};
