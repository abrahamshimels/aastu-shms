const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { findById, updateLastLogin } = require("../models/Staff.model");
require("dotenv").config();

// Login handler
router.post("/login", async (req, res) => {
  const { id, password } = req.body;
  console.log(`Login attempt for ID: ${id}`);

  try {
    // 1. Find staff by ID (e.g., ADM-001)
    const user = await findById(id);

    if (!user) {
      console.log(`User not found: ${id}`);
      return res.status(404).json({ message: "User not found" });
    }

    console.log(`User found: ${user.name}, Role: ${user.role}`);
    console.log(`Has password_hash: ${!!user.password_hash}`);

    // 2. Verify password
    if (!password || !user.password_hash) {
      console.error("Missing password or hash for comparison");
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      console.log(`Invalid password for user: ${id}`);
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // 3. Generate JWT Token
    // Frontend expects 'userType' and it should be lowercase (admin, doctor, etc)
    const userType = user.role.toLowerCase();
    const token = jwt.sign(
      { id: user.id, role: user.role, userType: userType, name: user.name },
      process.env.KEY,
      { expiresIn: "24h" }
    );

    console.log(`Login successful for: ${id} as ${userType}`);

    // Update last login timestamp
    try {
      await updateLastLogin(user.id);
      console.log(`Successfully updated last_login for: ${user.id}`);
    } catch (dbErr) {
      console.error(`Failed to update last_login for ${user.id}:`, dbErr.message);
    }

    // 4. Return success
    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        role: user.role,
        userType: userType, // Added for frontend compatibility
      },
    });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
