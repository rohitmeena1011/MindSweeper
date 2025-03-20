const mongoose = require("mongoose");
const User = require("../models/User.js");

// Connect to MongoDB
async function connectDB() {
    try {
        await mongoose.connect("mongodb+srv://rohitmeena3844:1xB9YgkF7x1lBd0P@cluster0.lae4c.mongodb.net/MindSweeper?retryWrites=true&w=majority&appName=MindSweeper", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("MongoDB Connected");
    } catch (err) {
        console.error("MongoDB Connection Error:", err);
        process.exit(1); // Exit if connection fails
    }
}

// Delete users after connection is established
async function deleteUsers() {
    try {
        await connectDB(); // Ensure database is connected
        const result = await User.deleteMany({ phoneNumber: 5656565656 });
        console.log(`${result.deletedCount} users deleted`);
    } catch (error) {
        console.error("Error deleting users:", error);
    } finally {
        mongoose.connection.close(); // Close connection after operation
    }
}

deleteUsers();
