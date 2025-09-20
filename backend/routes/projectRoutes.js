import express from "express";
import {
  createProject,
  getProjects,
  getProjectById,
  updateDonationProgress
} from "../controllers/projectController.js";

const router = express.Router();

// POST: Create project
router.post("/", createProject);

// GET: All projects
router.get("/", getProjects);

// GET: Single project by ID
router.get("/:id", getProjectById);

// PATCH: Update donation progress
router.patch("/:id/donation", updateDonationProgress);

export default router;
