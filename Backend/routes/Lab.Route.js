const express = require("express");
const {
    createTables,
    createRequest,
    getPendingRequests,
    submitLabRecord,
    getPatientLabHistory,
    reviewRecord,
    getDoctorLabHistory
} = require("../models/Lab.model");
const doctorAuth = require("../middlewares/doctorAuth");
const labAuth = require("../middlewares/labTechnologistAuth");

const router = express.Router();

// Initialize tables on first load of this route
router.use(async (req, res, next) => {
    try {
        await createTables();
        next();
    } catch (error) {
        res.status(500).send({ error: "Table initialization failed" });
    }
});

// DOCTOR: Create a new lab request
router.post("/request", doctorAuth.authenticate, async (req, res) => {
    const { patient_id, test_type, priority, notes, doctorID } = req.body;
    try {
        const authenticatedDoctorId = req.user?.doctorID || req.user?.id || doctorID;
        console.log("[lab/request] Incoming request", {
            body: {
                patient_id,
                doctorID,
                test_type,
                priority,
                notes,
            },
            authenticatedDoctorId,
            tokenDoctorClaim: req.user?.doctorID,
            tokenIdClaim: req.user?.id,
        });
        const result = await createRequest(patient_id, authenticatedDoctorId, test_type, priority || 'Normal', notes);
        console.log("[lab/request] Insert success", {
            requestId: result?.[0]?.id,
            patient_id,
            authenticatedDoctorId,
        });
        res.status(201).send({ message: "Lab request created", requestId: result[0].id });
    } catch (error) {
        console.error("[lab/request] Insert failed", {
            message: error.message,
            stack: error.stack,
            body: req.body,
            user: req.user,
        });
        res.status(400).send({ error: error.message });
    }
});

// LAB TECH: View pending requests
router.get("/requests/pending", labAuth.authenticate, async (req, res) => {
    try {
        const requests = await getPendingRequests();
        res.status(200).send(requests);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

// LAB TECH: Submit lab record (result)
router.post("/record", labAuth.authenticate, async (req, res) => {
    const { request_id, result_value, critical_flag, labTechID } = req.body;
    try {
        const result = await submitLabRecord(request_id, labTechID, result_value, critical_flag || false);
        res.status(201).send({ message: "Lab record submitted and request closed", recordId: result[0].id });
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

// DOCTOR/LAB TECH: View patient lab history
router.get("/history/:patientId", async (req, res) => {
    // Simple check for if patientId exists in params
    try {
        const history = await getPatientLabHistory(req.params.patientId);
        res.status(200).send(history);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

// DOCTOR: Review a lab record
router.patch("/record/:id/review", doctorAuth.authenticate, async (req, res) => {
    try {
        await reviewRecord(req.params.id);
        res.status(200).send({ message: "Record marked as reviewed by doctor" });
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

// DOCTOR: View all lab requests sent by this doctor
router.get("/history/doctor/:doctorId", doctorAuth.authenticate, async (req, res) => {
    try {
        const history = await getDoctorLabHistory(req.params.doctorId);
        res.status(200).send(history);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

module.exports = router;
