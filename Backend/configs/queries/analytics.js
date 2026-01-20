const getDailyStatsQuery = `
    -- Note: Hardcoded 0 for non-existent tables (student, consultation) 
    SELECT 
        0 as total_students,
        (SELECT COUNT(*) FROM staff WHERE role = 'DOCTOR') as total_doctors,
        0 as patients_served_today;
`;

const getRoleDistributionQuery = `
    SELECT role, COUNT(*) as count 
    FROM staff 
    GROUP BY role;
`;

const getWorkloadQuery = `
    -- Accepting $1 to prevent bind errors, but returning 0 for now
    SELECT 
        0 as doc_consultations,
        0 as lab_tests,
        0 as nurse_checkins
    FROM (SELECT $1::VARCHAR) AS dummy;
`;

module.exports = {
  getDailyStatsQuery,
  getRoleDistributionQuery,
  getWorkloadQuery,
};
