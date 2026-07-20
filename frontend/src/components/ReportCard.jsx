import { Link } from "react-router-dom";
import { MapPin, Calendar, ChevronUp, Construction, Trash2, Lightbulb, Droplets, AlertTriangle } from "lucide-react";

const priorityColors = {
  high: "bg-red-50 text-red-700 border-red-200",
  medium: "bg-amber-50 text-amber-700 border-amber-200",
  low: "bg-green-50 text-green-700 border-green-200",
};

const statusColors = {
  reported: "bg-gray-100 text-gray-700",
  in_progress: "bg-blue-50 text-blue-700",
  resolved: "bg-green-50 text-green-700",
  rejected: "bg-red-50 text-red-700",
};

const categoryIcons = {
  pothole: Construction,
  garbage: Trash2,
  streetlight: Lightbulb,
  water: Droplets,
  sewage: Droplets,
  other: AlertTriangle,
};

export default function ReportCard({ report }) {
  const CategoryIcon = categoryIcons[report.category] || AlertTriangle;

  return (
    <Link
      to={`/report/${report._id}`}
      className="group block bg-white rounded-2xl border border-[#dce8f5] p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
    >
      <div className="flex justify-between items-start mb-3 gap-3">
        <h3 className="font-display font-semibold text-navy text-lg leading-snug">
          {report.title}
        </h3>
        <span
          className={`shrink-0 text-xs font-medium px-2.5 py-1 rounded-full border ${priorityColors[report.priority]}`}
        >
          {report.priority}
        </span>
      </div>

      {report.imageUrl && (
        <img
          src={report.imageUrl}
          alt={report.title}
          className="w-full h-40 object-cover rounded-xl mb-3"
        />
      )}

      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{report.description}</p>

      <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
        <span className="capitalize inline-flex items-center gap-1.5 bg-[#eef3fb] text-primary px-2.5 py-1 rounded-full font-medium">
          <CategoryIcon size={13} />
          {report.category}
        </span>
        <span className={`px-2.5 py-1 rounded-full capitalize font-medium ${statusColors[report.status]}`}>
          {report.status.replace("_", " ")}
        </span>
        <span className="inline-flex items-center gap-1 text-gray-600 font-medium">
          <ChevronUp size={14} /> {report.upvotes?.length || 0}
        </span>
      </div>

      <div className="flex items-center gap-4 text-xs text-gray-400 pt-2 border-t border-[#eef3fb]">
        {report.incidentDate && (
          <span className="inline-flex items-center gap-1">
            <Calendar size={12} />
            {new Date(report.incidentDate).toLocaleDateString(undefined, {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </span>
        )}
        {report.location?.address && (
          <span className="inline-flex items-center gap-1 truncate">
            <MapPin size={12} />
            <span className="truncate">{report.location.address}</span>
          </span>
        )}
      </div>
    </Link>
  );
}
