import { useEffect, useState } from "react";
import { fetchReports, updateReportStatus } from "../api/reportApi.js";

export default function AdminDashboard() {
  const [reports, setReports] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");

  const load = async () => {
    const res = await fetchReports({ sortBy: "priority", status: statusFilter || undefined });
    setReports(res.data);
  };

  useEffect(() => {
    load();
  }, [statusFilter]);

  const handleStatusChange = async (id, status) => {
    await updateReportStatus(id, status);
    load();
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-navy mb-1">Admin Dashboard</h1>
      <p className="text-sm text-gray-500 mb-6">
        All reports sorted by AI-assigned priority. Update status as issues get resolved.
      </p>

      <select
        className="border border-[#dce8f5] rounded-lg px-3 py-2 text-sm bg-white mb-4"
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
      >
        <option value="">All Statuses</option>
        <option value="reported">Reported</option>
        <option value="in_progress">In Progress</option>
        <option value="resolved">Resolved</option>
        <option value="rejected">Rejected</option>
      </select>

      <div className="bg-white rounded-2xl border border-[#dce8f5] overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[#eef3fb] text-navy text-left">
            <tr>
              <th className="p-3">Title</th>
              <th className="p-3">Category</th>
              <th className="p-3">Priority</th>
              <th className="p-3">Status</th>
              <th className="p-3">Update</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((r) => (
              <tr key={r._id} className="border-t border-[#dce8f5]">
                <td className="p-3 text-navy">{r.title}</td>
                <td className="p-3 capitalize">{r.category}</td>
                <td className="p-3 capitalize">{r.priority}</td>
                <td className="p-3 capitalize">{r.status.replace("_", " ")}</td>
                <td className="p-3">
                  <select
                    value={r.status}
                    onChange={(e) => handleStatusChange(r._id, e.target.value)}
                    className="border border-[#dce8f5] rounded-lg px-2 py-1 text-xs"
                  >
                    <option value="reported">Reported</option>
                    <option value="in_progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {reports.length === 0 && (
        <p className="text-gray-500 text-center mt-8">No reports found.</p>
      )}
    </div>
  );
}
