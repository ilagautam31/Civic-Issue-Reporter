import Report from "../models/Report.js";
import { classifyReport } from "../utils/aiClassifier.js";
import { uploadBufferToCloudinary } from "../utils/cloudinaryUpload.js";

// POST /api/reports  (citizen, with optional image)
export const createReport = async (req, res) => {
  try {
    const { title, description, address, lat, lng, incidentDate } = req.body;

    if (!title || !description || lat === undefined || lng === undefined) {
      return res.status(400).json({ message: "Title, description and location are required" });
    }

    // Upload image to Cloudinary if one was provided 
    let imageUrl;
    if (req.file) {
      imageUrl = await uploadBufferToCloudinary(req.file.buffer);
    }

    // Run AI classification before saving — this is the "AI integration" step
    const { category, priority, aiReasoning } = await classifyReport(title, description, imageUrl);

    const report = await Report.create({
      reportedBy: req.user._id,
      title,
      description,
      imageUrl,
      location: { address, lat: Number(lat), lng: Number(lng) },
      incidentDate: incidentDate || Date.now(),
      category,
      priority,
      aiReasoning,
    });

    return res.status(201).json(report);
  } catch (err) {
    return res.status(500).json({ message: "Failed to create report", error: err.message });
  }
};

// GET /api/reports  (public feed, filterable)
// Query params: status, category, priority, sortBy=priority|recent
export const getReports = async (req, res) => {
  try {
    const { status, category, priority, sortBy = "recent" } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (priority) filter.priority = priority;

    let query = Report.find(filter).populate("reportedBy", "name");

    if (sortBy === "priority") {
      // High priority first — custom sort since enum order isn't alphabetical priority order
      const priorityRank = { high: 0, medium: 1, low: 2 };
      const reports = await query;
      reports.sort((a, b) => priorityRank[a.priority] - priorityRank[b.priority]);
      return res.json(reports);
    }

    const reports = await query.sort({ createdAt: -1 });
    return res.json(reports);
  } catch (err) {
    return res.status(500).json({ message: "Failed to fetch reports", error: err.message });
  }
};

// GET /api/reports/:id
export const getReportById = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id).populate("reportedBy", "name");
    if (!report) return res.status(404).json({ message: "Report not found" });
    return res.json(report);
  } catch (err) {
    return res.status(500).json({ message: "Failed to fetch report", error: err.message });
  }
};

// PATCH /api/reports/:id/upvote  (citizen)
export const upvoteReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) return res.status(404).json({ message: "Report not found" });

    const alreadyUpvoted = report.upvotes.some(
      (userId) => userId.toString() === req.user._id.toString()
    );

    if (alreadyUpvoted) {
      report.upvotes = report.upvotes.filter(
        (userId) => userId.toString() !== req.user._id.toString()
      );
    } else {
      report.upvotes.push(req.user._id);
    }

    await report.save();
    return res.json({ upvoteCount: report.upvotes.length, upvoted: !alreadyUpvoted });
  } catch (err) {
    return res.status(500).json({ message: "Failed to upvote report", error: err.message });
  }
};

// PATCH /api/reports/:id/status  (admin only)
export const updateReportStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ["reported", "in_progress", "resolved", "rejected"];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const report = await Report.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!report) return res.status(404).json({ message: "Report not found" });

    return res.json(report);
  } catch (err) {
    return res.status(500).json({ message: "Failed to update status", error: err.message });
  }
};
