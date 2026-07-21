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
    <div className="min-h-screen bg-slate-50">
      <div className="relative overflow-hidden px-6 py-10 sm:px-8">
        <div className="pointer-events-none absolute -right-16 top-8 h-72 w-72 rounded-full bg-sky-100/80 blur-3xl" />
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 max-w-3xl">
            <h1 className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
              Make civic issues visible, trustworthy, and ready for action.
            </h1>
            <p className="mt-4 text-base leading-7 text-slate-600">
              CivicTrack surfaces local issues, connects community reports, and keeps progress transparent.
            </p>
          </div>

          <section className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/50">
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.25em] text-slate-500">Issue Feed</p>
                <h2 className="mt-3 text-2xl font-semibold text-slate-950">Live reports from your city</h2>
              </div>
              <div className="grid w-full gap-3 sm:w-auto sm:grid-cols-3">
                <select
                  className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-sky-400 focus:outline-none"
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
                  className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-sky-400 focus:outline-none"
                  value={filters.priority}
                  onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
                >
                  <option value="">All Priorities</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>

                <select
                  className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-sky-400 focus:outline-none"
                  value={filters.sortBy}
                  onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                >
                  <option value="recent">Most Recent</option>
                  <option value="priority">Highest Priority</option>
                </select>
              </div>
            </div>
          <div className="space-y-4 mt-6">
            {status === "loading" && <p className="text-slate-600">Loading reports...</p>}
            {status === "failed" && <p className="text-rose-600">Failed to load reports.</p>}

            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {items.map((report) => (
                <ReportCard key={report._id} report={report} />
              ))}
            </div>

            {status === "succeeded" && items.length === 0 && (
              <p className="text-slate-600 text-center mt-8">No reports match these filters yet.</p>
            )}
          </div>
        </section>
        </div>
      </div>
    </div>
  );
}
