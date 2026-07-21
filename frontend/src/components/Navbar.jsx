import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/authSlice.js";
import { ChevronDown, LogOut, ShieldCheck, UserCircle } from "lucide-react";

const navItems = [
  { label: "Feed", to: "/" },
  { label: "Report Issue", to: "/report/new" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
    setOpen(false);
  };

  const initials = user?.name
    ?.split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <nav className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-6 py-3">
        <Link to="/" className="inline-flex items-center gap-3">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-100 text-sky-700 text-sm font-semibold">
            CT
          </span>
          <span className="text-xl font-semibold tracking-tight text-slate-950 sm:text-2xl">
            CivicTrack
          </span>
        </Link>

        <div className="flex flex-1 justify-center">
          <div className="flex items-center gap-8">
            {navItems.map((item) => {
              const active = location.pathname === item.to;
              return (
                <Link
                  key={item.label}
                  to={item.to}
                  className={`text-sm font-semibold transition ${
                    active
                      ? "text-slate-950 border-b-2 border-sky-500 pb-1"
                      : "text-slate-600 hover:text-slate-900 hover:border-b-2 hover:border-sky-200 pb-1"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>

        <div className="relative" ref={dropdownRef}>
          {user ? (
            <button
              type="button"
              onClick={() => setOpen((prev) => !prev)}
              className="inline-flex items-center gap-3 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm transition hover:border-sky-300"
            >
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-sky-100 text-sky-700 font-semibold">
                {initials || <UserCircle size={18} />}
              </span>
              <span className="rounded-full bg-sky-50 px-3 py-1 text-sm font-semibold text-sky-700">
                {user.name}
              </span>
              <ChevronDown size={16} className={`transition ${open ? "rotate-180" : ""}`} />
            </button>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-slate-900">
                Log In
              </Link>
              <Link
                to="/register"
                className="rounded-full border border-slate-200 bg-sky-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-700"
              >
                Register
              </Link>
            </div>
          )}

          {open && user && (
            <div className="absolute right-0 mt-3 min-w-[14rem] rounded-xl border border-slate-200 bg-white p-2 shadow-lg shadow-slate-200/60">
              {user?.role === "admin" && (
                <Link
                  to="/admin"
                  onClick={() => setOpen(false)}
                  className="block rounded-xl px-4 py-3 text-sm text-slate-900 transition hover:bg-slate-50"
                >
                  Admin Dashboard
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="mt-1 block w-full rounded-xl px-4 py-3 text-left text-sm text-slate-900 transition hover:bg-slate-50"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
