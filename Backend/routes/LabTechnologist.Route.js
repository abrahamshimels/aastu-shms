const express = require("express");
const {
    getAllLabTechs,
    createTables,
    findCred,
    findIfExists,
    addLabTech,
    getLabTechCredsFromEmail,
    updatePass,
} = require("../models/LabTechnologist.model");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const router = express.Router();

// GET all technologists
router.get("/", async (req, res) => {
    try {
        await createTables();
        const result = await getAllLabTechs();
        res.status(200).send(result);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

// REGISTER a new technologist
router.post("/register", async (req, res) => {
    try {
        await createTables();
        const exists = await findIfExists(req.body.email);
        if (exists.length > 0) {
            return res.status(400).send({ message: "Technologist already exists" });
        }
        await addLabTech(req.body);
        const data = await findIfExists(req.body.email);
        res.status(201).send({ email: data[0].email, message: "Registered Successfully" });
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
});

// LOGIN technologist
router.post("/login", async (req, res) => {
    const { id, password } = req.body;
    try {
        const user = await findCred(id);
        if (user && user.length > 0 && password === user[0].password) {
            const token = jwt.sign({ labTechID: user[0].id }, process.env.KEY, {
                expiresIn: "24h",
            });
            res.send({
                message: "Login Successful",
                user: { ...user[0], userType: "lab_technologist" },
                token: token,
            });
        } else {
            res.status(401).send({ message: "Wrong credentials" });
        }
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

// Update password
router.patch("/:id", async (req, res) => {
    const { id } = req.params;
    const { password } = req.body;
    try {
        await updatePass(password, id);
        res.status(200).send({ message: "Password updated successfully" });
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
});

module.exports = router;
