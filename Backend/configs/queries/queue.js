const createQueueTable = `
    CREATE TABLE IF NOT EXISTS queue (
        id SERIAL PRIMARY KEY,
        patient_name VARCHAR(100) NOT NULL,
        department VARCHAR(100) NOT NULL,
        status VARCHAR(50) DEFAULT 'Waiting',
        wait_time VARCHAR(20) DEFAULT '10-20 mins',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
`;

const getPublicQueueQuery = `
    SELECT id, patient_name, department, status, wait_time 
    FROM queue 
    ORDER BY created_at ASC;
`;

const addToQueueQuery = `
    INSERT INTO queue (patient_name, department, status, wait_time)
    VALUES ($1, $2, $3, $4) RETURNING *;
`;

module.exports = {
  createQueueTable,
  getPublicQueueQuery,
  addToQueueQuery,
};
