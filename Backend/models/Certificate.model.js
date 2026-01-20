const dbhelper = require("../configs/dbhelper");
const {
  createCertificateQuery,
  getCertificatesForNurseQuery,
  getCertificatesForStudentQuery,
  getCertificatesForDoctorQuery,
} = require("../configs/queries/certificate");

const createCertificate = (data) => {
  const { student_id, doctor_id, type, issue_date, content } = data;
  return dbhelper.query(createCertificateQuery, [
    student_id,
    doctor_id,
    type,
    issue_date || new Date(),
    content,
  ]).then((result) => {
    return result[0];
  });
};

const getCertificatesForNurse = () => {
  return dbhelper.query(getCertificatesForNurseQuery, []).then((result) => {
    return result;
  });
};

const getCertificatesForStudent = (student_id) => {
  return dbhelper.query(getCertificatesForStudentQuery, [student_id]).then((result) => {
    return result;
  });
};

const getCertificatesForDoctor = (doctor_id) => {
  return dbhelper.query(getCertificatesForDoctorQuery, [doctor_id]).then((result) => {
    return result;
  });
};

module.exports = {
  createCertificate,
  getCertificatesForNurse,
  getCertificatesForStudent,
  getCertificatesForDoctor,
};
