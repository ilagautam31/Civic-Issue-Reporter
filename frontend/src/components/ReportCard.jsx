import { Link } from "react-router-dom";

const priorityColors = {
  high: "bg-red-100 text-red-700 border-red-300",
  medium: "bg-amber-100 text-amber-700 border-amber-300",
  low: "bg-green-100 text-green-700 border-green-300",
};

const statusColors = {
  reported: "bg-gray-100 text-gray-700",
  in_progress: "bg-blue-100 text-blue-700",
  resolved: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
};

export default function ReportCard({ report }) {
  return (
    <Link
      to={`/report/${report._id}`}
      className="block bg-white rounded-2xl border border-[#dce8f5] p-4 hover:shadow-md transition-shadow"
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-navy text-lg">{report.title}</h3>
        <span
          className={`text-xs px-2 py-1 rounded-full border ${priorityColors[report.priority]}`}
        >
          {report.priority} priority
        </span>
      </div>

      {report.imageUrl && (
        <img
          src={`${import.meta.env.VITE_API_BASE || "https://civic-issue-reporter-nf72.onrender.com"}${report.imageUrl}`}
          alt={report.title}
          className="w-full h-40 object-cover rounded-xl mb-3"
        />
      )}

      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{report.description}</p>

      <div className="flex items-center justify-between text-xs text-gray-500">
        <span className="capitalize bg-[#eef3fb] px-2 py-1 rounded-full">
          {report.category}
        </span>
        <span className={`px-2 py-1 rounded-full ${statusColors[report.status]}`}>
          {report.status.replace("_", " ")}
        </span>
        <span>▲ {report.upvotes?.length || 0}</span>
      </div>
      {report.incidentDate && (
        <p className="text-xs text-gray-400 mt-2">
          Reported issue date: {new Date(report.incidentDate).toLocaleDateString()}
        </p>
      )}
    </Link>
  );
}