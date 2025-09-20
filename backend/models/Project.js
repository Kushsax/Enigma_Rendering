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

    // ✅ In-kind donation fields
    acceptsInKind: {
      type: Boolean,
      default: false,
    },
    items: {
      type: [String],
      default: [],
    },

    // ✅ Moderation + creator tracking
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // assumes you have a User model
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "declined"],
      default: "pending",
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    approvedAt: {
      type: Date,
    },
    declinedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    declinedAt: {
      type: Date,
    },
    declinedReason: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const Project = mongoose.model("Project", projectSchema);

export default Project;
