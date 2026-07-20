import express from "express";
import {
  createReport,
  getReports,
  getReportById,
  upvoteReport,
  updateReportStatus,
} from "../controllers/reportController.js";
import { protect, adminOnly } from "../middleware/auth.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.get("/", getReports);
router.get("/:id", getReportById);
router.post("/", protect, upload.single("image"), createReport);
router.patch("/:id/upvote", protect, upvoteReport);
router.patch("/:id/status", protect, adminOnly, updateReportStatus);

export default router;
