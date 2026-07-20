import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { fetchReportById, upvoteReport, updateReportStatus } from "../api/reportApi.js";

export default function ReportDetail() {
  const { id } = useParams();
  const { user } = useSelector((state) => state.auth);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const res = await fetchReportById(id);
    setReport(res.data);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, [id]);

  const handleUpvote = async () => {
    await upvoteReport(id);
    load();
  };

  const handleStatusChange = async (status) => {
    await updateReportStatus(id, status);
    load();
  };

  if (loading) return <p className="text-center mt-10 text-gray-500">Loading...</p>;
  if (!report) return <p className="text-center mt-10 text-red-600">Report not found.</p>;

  return (
    <div className="max-w-2xl mx-auto mt-8 bg-white rounded-2xl border border-[#dce8f5] p-8">
      <div className="flex justify-between items-start mb-4">
        <h1 className="font-display text-2xl font-semibold text-navy">{report.title}</h1>
        <span className="text-xs px-3 py-1 rounded-full bg-[#eef3fb] text-primary capitalize">
          {report.category}
        </span>
      </div>

      {report.imageUrl && (
        <img
          src={report.imageUrl}
          alt={report.title}
          className="w-full h-64 object-cover rounded-xl mb-4"
        />
      )}

      <p className="text-gray-700 mb-2">{report.description}</p>
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500 mb-4">
        {report.location?.address && (
          <a
            href={`https://www.google.com/maps?q=${report.location.lat},${report.location.lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary hover:underline"
          >
            📍 {report.location.address}
          </a>
        )}
        {report.incidentDate && (
          <span>🗓 Noticed on {new Date(report.incidentDate).toLocaleDateString()}</span>
        )}
        {report.createdAt && (
          <span>
            🕐 Submitted{" "}
            {new Date(report.createdAt).toLocaleString(undefined, {
              day: "numeric",
              month: "short",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        )}
      </div>

      <div className="bg-[#0c1f42] text-white rounded-xl p-4 mb-4">
        <p className="text-xs uppercase tracking-wide text-gray-300 mb-1">AI Assessment</p>
        <p className="text-sm">
          Priority: <span className="font-semibold capitalize">{report.priority}</span>
        </p>
        {report.aiReasoning && (
          <p className="text-sm text-gray-300 mt-1">{report.aiReasoning}</p>
        )}
      </div>

      <div className="flex items-center justify-between mb-4">
        <button
          onClick={handleUpvote}
          className="bg-[#eef3fb] text-primary px-4 py-2 rounded-lg text-sm"
        >
          ▲ Upvote ({report.upvotes?.length || 0})
        </button>
        <span className="text-sm text-gray-500 capitalize">
          Status: {report.status.replace("_", " ")}
        </span>
      </div>

      {user?.role === "admin" && (
        <div className="border-t border-[#dce8f5] pt-4 mt-4">
          <p className="text-sm font-medium text-navy mb-2">Admin: Update Status</p>
          <div className="flex gap-2 flex-wrap">
            {["reported", "in_progress", "resolved", "rejected"].map((s) => (
              <button
                key={s}
                onClick={() => handleStatusChange(s)}
                className={`text-xs px-3 py-1 rounded-full border ${
                  report.status === s
                    ? "bg-primary text-white border-primary"
                    : "border-[#dce8f5] text-gray-600"
                }`}
              >
                {s.replace("_", " ")}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
