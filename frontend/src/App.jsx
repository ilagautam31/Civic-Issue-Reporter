import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import ReportForm from "./pages/ReportForm.jsx";
import ReportDetail from "./pages/ReportDetail.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import { RequireAuth, RequireAdmin } from "./components/RouteGuards.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/report/:id" element={<ReportDetail />} />
        <Route
          path="/report/new"
          element={
            <RequireAuth>
              <ReportForm />
            </RequireAuth>
          }
        />
        <Route
          path="/admin"
          element={
            <RequireAdmin>
              <AdminDashboard />
            </RequireAdmin>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
