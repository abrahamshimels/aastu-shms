const createCertificateQuery = `
  INSERT INTO certificates (student_id, doctor_id, type, issue_date, content)
  VALUES ($1, $2, $3, $4, $5)
  RETURNING *;
`;

const getCertificatesForNurseQuery = `
  SELECT c.*, p.name as student_name, p.studentid as student_display_id, d.name as doctor_name, p.department, p.year
  FROM certificates c
  JOIN patients p ON c.student_id = p.id
  JOIN doctors d ON c.doctor_id = d.id
  ORDER BY c.issue_date DESC, c.id DESC;
`;

const getCertificatesForStudentQuery = `
  SELECT c.*, d.name as doctor_name
  FROM certificates c
  JOIN doctors d ON c.doctor_id = d.id
  WHERE c.student_id = $1
  ORDER BY c.issue_date DESC;
`;

const getCertificatesForDoctorQuery = `
  SELECT c.*, p.name as student_name
  FROM certificates c
  JOIN patients p ON c.student_id = p.id
  WHERE c.doctor_id = $1
  ORDER BY c.issue_date DESC;
`;

module.exports = {
  createCertificateQuery,
  getCertificatesForNurseQuery,
  getCertificatesForStudentQuery,
  getCertificatesForDoctorQuery,
};
