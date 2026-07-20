import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadReports } from "../redux/reportsSlice.js";
import ReportCard from "../components/ReportCard.jsx";

export default function Home() {
  const dispatch = useDispatch();
  const { items, status } = useSelector((state) => state.reports);
  const [filters, setFilters] = useState({ category: "", priority: "", sortBy: "recent" });

  useEffect(() => {
    dispatch(loadReports(filters));
  }, [dispatch, filters]);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="bg-gradient-to-br from-[#f8fafd] to-[#e7eff9] rounded-2xl p-6 mb-6">
        <h1 className="text-2xl font-bold text-navy mb-1">Civic Issue Feed</h1>
        <p className="text-gray-600 text-sm">
          Report local issues, track resolution, help your community stay accountable.
        </p>
      </div>

      <div className="flex gap-3 mb-6 flex-wrap">
        <select
          className="border border-[#dce8f5] rounded-lg px-3 py-2 text-sm bg-white"
          value={filters.category}
          onChange={(e) => setFilters({ ...filters, category: e.target.value })}
        >
          <option value="">All Categories</option>
          <option value="pothole">Pothole</option>
          <option value="garbage">Garbage</option>
          <option value="streetlight">Streetlight</option>
          <option value="water">Water</option>
          <option value="sewage">Sewage</option>
          <option value="other">Other</option>
        </select>

        <select
          className="border border-[#dce8f5] rounded-lg px-3 py-2 text-sm bg-white"
          value={filters.priority}
          onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
        >
          <option value="">All Priorities</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>

        <select
          className="border border-[#dce8f5] rounded-lg px-3 py-2 text-sm bg-white"
          value={filters.sortBy}
          onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
        >
          <option value="recent">Most Recent</option>
          <option value="priority">Highest Priority</option>
        </select>
      </div>

      {status === "loading" && <p className="text-gray-500">Loading reports...</p>}
      {status === "failed" && <p className="text-red-600">Failed to load reports.</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((report) => (
          <ReportCard key={report._id} report={report} />
        ))}
      </div>

      {status === "succeeded" && items.length === 0 && (
        <p className="text-gray-500 text-center mt-8">No reports match these filters yet.</p>
      )}
    </div>
  );
}
