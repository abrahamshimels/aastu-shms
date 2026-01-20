const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { findById } = require("../models/Staff.model");
require("dotenv").config();

// Login handler
router.post("/login", async (req, res) => {
  const { id, password } = req.body;

  try {
    // 1. Find staff by ID (e.g., ADM-001)
    const user = await findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 2. Verify password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // 3. Generate JWT Token
    const token = jwt.sign(
      { id: user.id, role: user.role, name: user.name },
      process.env.KEY,
      { expiresIn: "24h" }
    );

    // 4. Return success
    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
