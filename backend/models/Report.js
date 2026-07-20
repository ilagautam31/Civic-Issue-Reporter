import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true, trim: true, maxlength: 120 },
    description: { type: String, required: true, maxlength: 1000 },
    imageUrl: { type: String }, // path to uploaded photo
    location: {
      address: { type: String, trim: true },
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    incidentDate: { type: Date, default: Date.now }, // when the issue was observed/occurred
    // Set by AI classifier after creation
    category: {
      type: String,
      enum: ["pothole", "garbage", "streetlight", "water", "sewage", "other"],
      default: "other",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    aiReasoning: { type: String }, // short explanation from AI for transparency/audit

    status: {
      type: String,
      enum: ["reported", "in_progress", "resolved", "rejected"],
      default: "reported",
    },
    upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

// Common query pattern: filter open reports near a location, sorted by priority
reportSchema.index({ status: 1, priority: 1 });
reportSchema.index({ "location.lat": 1, "location.lng": 1 });

export default mongoose.model("Report", reportSchema);