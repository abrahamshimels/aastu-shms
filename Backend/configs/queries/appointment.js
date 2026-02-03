const createAppointmentQueryTable = `CREATE TABLE IF NOT EXISTS appointments (
  id SERIAL PRIMARY KEY,
  patient_id VARCHAR(50) NOT NULL,
  date DATE NOT NULL,
  time TIME NOT NULL,
  problem TEXT,
  doctor_id VARCHAR(50) NOT NULL,
  FOREIGN KEY (patient_id) REFERENCES patients(studentid),
  FOREIGN KEY (doctor_id) REFERENCES staff(id)
);`;

const countAppoinmentQuery = `SELECT COUNT(*) FROM appointments; `;

const createAppointmentQuery = `
INSERT INTO appointments (patient_id, date, time, problem, doctor_id)
VALUES (
    $1,
    $2,
    $3,
    $4,
    $5
  );`;

const getAppointmentFromPatientQuery = `
  SELECT a.*, s.name as doctor_name 
  FROM appointments a
  JOIN staff s ON a.doctor_id = s.id
  WHERE a.patient_id = $1;
`;

const getAppointmentFromDoctorQuery = `
  SELECT a.*, p.name as patient_name 
  FROM appointments a
  JOIN patients p ON a.patient_id = p.studentid
  WHERE a.doctor_id = $1;
`;

const findByIDQuery = `SELECT * FROM appointments WHERE id = $1;`;

const getAllAppointmentsQuery = `
  SELECT a.*, p.name as patient_name, s.name as doctor_name 
  FROM appointments a
  JOIN patients p ON a.patient_id = p.studentid
  JOIN staff s ON a.doctor_id = s.id;
`;

const deleteAppointmentQuery = `DELETE FROM appointments WHERE id = $1;`;

module.exports = {
  deleteAppointmentQuery,
  countAppoinmentQuery,
  createAppointmentQuery,
  getAppointmentFromPatientQuery,
  getAppointmentFromDoctorQuery,
  findByIDQuery,
  getAllAppointmentsQuery,
  createAppointmentQueryTable,
};
