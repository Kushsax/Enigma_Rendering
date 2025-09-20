import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    details: {
      type: String,
      required: true,
    },
    images: {
      type: [String], // Array of image URLs
      default: [],
    },
    donationGoal: {
      type: Number,
      required: true,
      min: 0,
    },
    donationProgress: {
      type: Number,
      default: 0,
      min: 0,
    },

  },
  { timestamps: true }
);

const Project = mongoose.model("Project", projectSchema);

export default Project;
