const createStaffTable = `
CREATE TABLE IF NOT EXISTS staff (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('ADMIN', 'NURSE', 'DOCTOR', 'LAB_TECH')),
    qualification VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`;

const addStaffQuery = `
    INSERT INTO staff (id, name, email, password_hash, role, qualification)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *;
`;

const findByEmailQuery = `SELECT * FROM staff WHERE email = $1;`;

const findByIdQuery = `SELECT id, name, email, role, qualification, is_active, last_login, created_at FROM staff WHERE id = $1;`;

const getAllStaffQuery = `SELECT id, name, email, role, qualification, is_active, last_login, created_at FROM staff ORDER BY created_at DESC;`;

const updateStaffQuery = `
    UPDATE staff 
    SET name = $2, email = $3, role = $4, qualification = $5, is_active = $6
    WHERE id = $1
    RETURNING id, name, email, role, qualification, is_active;
`;

const countStaffByRoleQuery = `SELECT COUNT(*) AS count FROM staff WHERE role = $1;`;

const updatePasswordQuery = `UPDATE staff SET password_hash = $2 WHERE id = $1;`;

module.exports = {
  createStaffTable,
  addStaffQuery,
  findByEmailQuery,
  findByIdQuery,
  getAllStaffQuery,
  updateStaffQuery,
  countStaffByRoleQuery,
  updatePasswordQuery,
};
