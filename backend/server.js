import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./models/db.js";
import bodyParser from "body-parser";
import cors from "cors";

// Routes
import authRouter from "./routes/authRouter.js";
import projectRouter from "./routes/projectRoutes.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB (same DB for users + projects)
connectDB();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Routes
app.use("/auth", authRouter);            // Login/Auth
app.use("/api/projects", projectRouter); // Project posting

// Server start
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
