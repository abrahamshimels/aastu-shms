const getDailyStatsQuery = `
    SELECT 
        (SELECT COUNT(*) FROM staff WHERE role = 'DOCTOR') as total_doctors,
        (SELECT COUNT(*) FROM queue WHERE status = 'Visited' AND created_at::date = CURRENT_DATE) as patients_served_today,
        (SELECT AVG(EXTRACT(EPOCH FROM (created_at - created_at)) / 60) FROM queue WHERE status = 'Visited' AND created_at::date = CURRENT_DATE) as avg_wait_time
    ;
`;

const getRoleDistributionQuery = `
    SELECT role, COUNT(*) as count 
    FROM staff 
    GROUP BY role;
`;

const getWorkloadQuery = `
    SELECT 
        id, name, role,
        (SELECT COUNT(*) FROM reports WHERE doctor_id = staff.id) as total_reports
    FROM staff
    WHERE role IN ('DOCTOR', 'NURSE', 'LAB_TECH');
`;

const getOverviewCountsQuery = `
    SELECT 
        (SELECT COUNT(*) FROM patients) as patient,
        (SELECT COUNT(*) FROM staff WHERE role = 'DOCTOR') as doctor,
        (SELECT COUNT(*) FROM staff WHERE role = 'ADMIN') as admin,
        (SELECT COUNT(*) FROM queue) as appointment,
        (SELECT COUNT(*) FROM reports) as report,
        (SELECT 5) as ambulance
    ;
`;

module.exports = {
  getDailyStatsQuery,
  getRoleDistributionQuery,
  getWorkloadQuery,
  getOverviewCountsQuery,
};
