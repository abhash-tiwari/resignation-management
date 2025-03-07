import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoutes from "./routes/Auth.js";
import userRoutes from "./routes/User.js";
import adminRoutes from "./routes/Admin.js";
import User from "./models/User.js";

dotenv.config();

const app = express();

app.use(cors());

app.use(express.json());

const createAdminUser = async () => {
  try {
    const adminExists = await User.findOne({ username: "admin" });
    if (!adminExists) {
      const admin = new User({
        username: "admin",
        password: "admin",
        role: "hr",
      });
      await admin.save();
      console.log("Admin created successfully");
    }
  } catch (error) {
    console.error("Error creating admin:", error);
  }
};

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    createAdminUser();
  })
  .catch((err) => console.error("MongoDB connection error:", err));

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});