import Project from "../models/Project.js";

// Create a new project
export const createProject = async (req, res) => {
  try {
    const { name, details, images, donationGoal, donationProgress, acceptsInKind, items } = req.body;

    const newProject = new Project({
      name,
      details,
      images,
      donationGoal,
      donationProgress,
      acceptsInKind,
      items,
    });

    const savedProject = await newProject.save();
    res.status(201).json({
      success: true,
      message: "Project created successfully!",
      project: savedProject,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
// Get all projects
export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json({ success: true, projects });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single project
export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project)
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });

    res.json({ success: true, project });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update project donation progress only
export const updateDonationProgress = async (req, res) => {
  try {
    const { donationProgress } = req.body;
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { donationProgress },
      { new: true }
    );
    if (!project)
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });

    res.json({
      success: true,
      message: "Donation progress updated",
      project,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Update full project (for editing)
export const updateProject = async (req, res) => {
  try {
    const { name, details, images, donationGoal, donationProgress } = req.body;

    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      { name, details, images, donationGoal, donationProgress },
      { new: true, runValidators: true }
    );

    if (!updatedProject) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }

    res.json({
      success: true,
      message: "Project updated successfully",
      project: updatedProject,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Delete project
export const deleteProject = async (req, res) => {
  try {
    const deletedProject = await Project.findByIdAndDelete(req.params.id);

    if (!deletedProject) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }

    res.json({ success: true, message: "Project deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
