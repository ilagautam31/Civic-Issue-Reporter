import { Link } from "react-router-dom";

const statusMap = {
  reported: "Pending",
  in_progress: "In Progress",
  resolved: "Resolved",
  rejected: "Rejected",
};

export default function ReportCard({ report }) {
  const classification = (report.aiClassification || report.classification || "Medium").toLowerCase();
  const classificationLabel = classification.charAt(0).toUpperCase() + classification.slice(1);
  const formattedStatus = statusMap[report.status] || report.status?.replace("_", " ") || "Unknown";
  const incidentDate = report.incidentDate ? new Date(report.incidentDate) : null;
  const dateLabel = incidentDate
    ? `${incidentDate.toLocaleDateString(undefined, {
        day: "numeric",
        month: "short",
        year: "numeric",
      })} • ${incidentDate.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })}`
    : "Date unavailable";
  const location = report.location?.address || "Location unavailable";
  const upvotes = report.upvotes?.length || 0;

  return (
    <Link
      to={`/report/${report._id}`}
      className="group block overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-lg font-semibold tracking-tight text-slate-950">{report.title}</h3>
          <span className="inline-flex rounded-full border border-yellow-200 bg-yellow-50 px-3 py-1 text-sm font-semibold text-yellow-800">
            {classificationLabel}
          </span>
        </div>

        {report.imageUrl && (
          <img
            src={report.imageUrl}
            alt={report.title}
            className="h-48 w-full rounded-[1.25rem] object-cover"
          />
        )}

        <p className="text-sm leading-6 text-slate-600">{report.description}</p>

        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm font-semibold text-slate-700">Current Status:</span>
          <span className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${
            formattedStatus === 'Rejected'
              ? 'bg-rose-100 text-rose-700 border border-rose-200'
              : formattedStatus === 'Resolved'
              ? 'bg-sky-100 text-sky-700 border border-sky-200'
              : formattedStatus === 'In Progress'
              ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
              : 'bg-slate-100 text-slate-700 border border-slate-200'
          }`}>
            {formattedStatus}
          </span>
        </div>

        <div className="mt-4 border-t border-slate-200 pt-4 text-sm text-slate-500">
          <div className="flex items-center justify-between">
            <div>{dateLabel}</div>
            <div className="inline-flex items-center rounded-full bg-sky-50 px-3 py-1 text-sm font-semibold text-sky-700">
              {upvotes} upvotes
            </div>
          </div>
          <div className="mt-2 text-sm text-slate-500">📍{location}</div>
        </div>
      </div>
    </Link>
  );
}
