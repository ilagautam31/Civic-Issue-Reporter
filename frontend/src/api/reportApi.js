import api from "./axios.js";

export const fetchReports = (params) => api.get("/reports", { params });
export const fetchReportById = (id) => api.get(`/reports/${id}`);

// multipart/form-data because we're sending an image file
export const createReport = (formData) =>
  api.post("/reports", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const upvoteReport = (id) => api.patch(`/reports/${id}/upvote`);
export const updateReportStatus = (id, status) =>
  api.patch(`/reports/${id}/status`, { status });
