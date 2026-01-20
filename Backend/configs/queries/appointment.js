const countAppoinmentQuery = `SELECT COUNT(*) FROM appointments; `;

const createAppointmentQuery = `
INSERT INTO appointments (patientid, date, time, problem, doctorid)
VALUES (
    $1,
    $2,
    $3,
    $4,
    $5
  );`;

const getAppointmentFromPatientQuery = `
  SELECT a.*, d.name as doctor_name 
  FROM appointments a
  JOIN doctors d ON a.doctorid = d.id
  WHERE a.patientid = $1;
`;

const getAppointmentFromDoctorQuery = `
  SELECT a.*, p.name as patient_name 
  FROM appointments a
  JOIN patients p ON a.patientid = p.id
  WHERE a.doctorid = $1;
`;

const findByIDQuery = `SELECT * FROM appointments WHERE id = $1;`;

const getAllAppointmentsQuery = `
  SELECT a.*, p.name as patient_name, d.name as doctor_name 
  FROM appointments a
  JOIN patients p ON a.patientid = p.id
  JOIN doctors d ON a.doctorid = d.id;
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
};
