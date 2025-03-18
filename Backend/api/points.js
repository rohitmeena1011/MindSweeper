const express = require("express");
const router = express.Router();
const User = require("../models/User");

// POST API to update user points
router.post("/update-points", async (req, res) => {
    try {
        const { email_id, points } = req.body;

        // Validate request data
        if (!email_id || typeof points !== "number") {
            return res.status(400).json({ error: "Invalid email or points" });
        }

        // Find the user and update points
        const user = await User.findOneAndUpdate(
            { email: email_id }, // Find user by email
            { $inc: { points: points } }, // Increment points
            { new: true } // Return updated document
        );

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json({ message: "Points updated successfully", user });
    } catch (error) {
        console.error("Error updating points:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;
