// Dummy Doctor model created to fix startup error
// This file was missing, preventing the server from starting.

module.exports = {
    getDoctorCredFromEmail: async (email) => {
        console.log(`[Dummy Model] getDoctorCredFromEmail called with ${email}`);
        // Return empty array to simulate no doctor found
        return [];
    },
    createTables: async () => {
        console.log("[Dummy Model] Doctor table creation (Skipped)");
    }
};
