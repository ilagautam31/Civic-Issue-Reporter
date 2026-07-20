import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/authSlice.js";

export default function Navbar() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <nav className="bg-white border-b border-[#dce8f5] px-6 py-4 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold text-primary">
        Civic Reporter
      </Link>
      <div className="flex items-center gap-4">
        <Link to="/" className="text-navy hover:text-primary">
          Feed
        </Link>
        {user && (
          <Link to="/report/new" className="text-navy hover:text-primary">
            Report Issue
          </Link>
        )}
        {user?.role === "admin" && (
          <Link to="/admin" className="text-navy hover:text-primary">
            Admin Dashboard
          </Link>
        )}
        {user ? (
          <>
            <span className="text-sm text-gray-500">Hi, {user.name}</span>
            <button
              onClick={handleLogout}
              className="bg-primary text-white px-4 py-2 rounded-lg text-sm"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-navy hover:text-primary">
              Login
            </Link>
            <Link
              to="/register"
              className="bg-primary text-white px-4 py-2 rounded-lg text-sm"
            >
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
