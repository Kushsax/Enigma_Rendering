import express from "express";
import {
  createProject,
  getProjects,
  getProjectById,
  updateDonationProgress,
  updateProject,
  deleteProject
} from "../controllers/projectController.js";

const router = express.Router();

// POST: Create project
router.post("/", createProject);

// GET: All projects
router.get("/", getProjects);

// GET: Single project by ID
router.get("/:id", getProjectById);

// PUT: Update project (full update for edit functionality)
router.put("/:id", updateProject);

// DELETE: Delete project
router.delete("/:id", deleteProject);

// PATCH: Update donation progress only
router.patch("/:id/donation", updateDonationProgress);

export default router;
