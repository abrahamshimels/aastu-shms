const pool = require('./configs/db');

async function migrate() {
    console.log("Starting unified ID standardization migration...");
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // 1. Identify and Drop Foreign Key Constraints
        const constraintsRes = await client.query(`
            SELECT conname, table_name
            FROM (
                SELECT conname, relname as table_name
                FROM pg_constraint c
                JOIN pg_class cl ON cl.oid = c.conrelid
                JOIN pg_namespace n ON n.oid = c.connamespace
                WHERE contype = 'f' AND n.nspname = 'public'
            ) sub;
        `);

        for (const row of constraintsRes.rows) {
            console.log(`Dropping constraint ${row.conname} on ${row.table_name}...`);
            await client.query(`ALTER TABLE "${row.table_name}" DROP CONSTRAINT IF EXISTS "${row.conname}"`);
        }

        // 2. Change Primary Key columns to VARCHAR(50)
        const tablesWithId = [
            'staff', 'admins', 'nurses', 'doctors', 'laboratory_technologists', 'patients',
            'ambulance', 'medication', 'audit_logs', 'system_config', 'queue', 'lab_records',
            'lab_test_requests', 'appointments', 'reports', 'certificates'
        ];

        for (const table of tablesWithId) {
            console.log(`Converting ${table}.id to VARCHAR(50)...`);
            // Use 'USING id::character varying' to safely convert if it was INT
            await client.query(`ALTER TABLE "${table}" ALTER COLUMN id TYPE VARCHAR(50) USING id::character varying`);
        }

        // 3. Change Foreign Key columns to VARCHAR(50)
        const fkMapiings = [
            { table: 'patients', col: 'docid' },
            { table: 'appointments', col: 'patientid' },
            { table: 'appointments', col: 'doctorid' },
            { table: 'queue', col: 'student_id' },
            { table: 'queue', col: 'patient_id' },
            { table: 'queue', col: 'doctor_id' },
            { table: 'lab_test_requests', col: 'patient_id' },
            { table: 'lab_test_requests', col: 'doctor_id' },
            { table: 'lab_records', col: 'request_id' },
            { table: 'lab_records', col: 'technologist_id' },
            { table: 'reports', col: 'patient_id' },
            { table: 'reports', col: 'doctor_id' },
            { table: 'certificates', col: 'student_id' },
            { table: 'certificates', col: 'doctor_id' },
            { table: 'audit_logs', col: 'user_id' }
        ];

        for (const mapping of fkMapiings) {
            console.log(`Converting ${mapping.table}.${mapping.col} to VARCHAR(50)...`);
            await client.query(`ALTER TABLE "${mapping.table}" ALTER COLUMN "${mapping.col}" TYPE VARCHAR(50) USING "${mapping.col}"::character varying`);
        }

        // 4. Re-establish basic foreign keys (optional but good for integrity)
        // We might skip this if we want to be more flexible with alphanumeric IDs that might not exist in the linked table yet
        // But for now, let's try to restore the important ones

        console.log("Re-establishing critical foreign keys...");
        try {
            await client.query('ALTER TABLE appointments ADD FOREIGN KEY (patientid) REFERENCES patients(id)');
            await client.query('ALTER TABLE appointments ADD FOREIGN KEY (doctorid) REFERENCES staff(id)'); // Link to staff(id) now!
            await client.query('ALTER TABLE reports ADD FOREIGN KEY (patient_id) REFERENCES patients(id)');
            await client.query('ALTER TABLE reports ADD FOREIGN KEY (doctor_id) REFERENCES staff(id)');
            await client.query('ALTER TABLE lab_test_requests ADD FOREIGN KEY (patient_id) REFERENCES patients(id)');
            await client.query('ALTER TABLE lab_test_requests ADD FOREIGN KEY (doctor_id) REFERENCES staff(id)');
        } catch (fkErr) {
            console.warn("Could not re-establish some foreign keys (likely due to inconsistent data):", fkErr.message);
        }

        await client.query('COMMIT');
        console.log("✅ Unified ID standardization completed successfully!");
    } catch (err) {
        await client.query('ROLLBACK');
        console.error("❌ Migration failed:", err);
    } finally {
        client.release();
        await pool.end();
    }
}

migrate();
