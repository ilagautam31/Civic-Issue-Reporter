import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createReport } from "../api/reportApi.js";

const todayDate = () => new Date().toISOString().split("T")[0];

export default function ReportForm() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    address: "",
    incidentDate: todayDate(),
  });
  const [image, setImage] = useState(null);
  const [location, setLocation] = useState({ lat: "", lng: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [locating, setLocating] = useState(false);
  const navigate = useNavigate();

  // Convenience option: browser geolocation. Also fills the address field
  // via reverse geocoding so the user sees a readable location, not just numbers.
  const detectLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation not supported by this browser — enter the address below instead");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        setLocation({ lat: latitude, lng: longitude });
        setError("");
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await res.json();
          if (data.display_name) {
            setForm((f) => ({ ...f, address: data.display_name }));
          }
        } catch {
          // reverse geocoding failing is non-critical — coordinates are already set
        } finally {
          setLocating(false);
        }
      },
      (err) => {
        setLocating(false);
        if (err.code === 1) {
          setError("Location permission denied — type the address below instead");
        } else {
          setError("Could not detect location — type the address below instead");
        }
      },
      { timeout: 8000 }
    );
  };

  // Primary path: user types an address, we geocode it to lat/lng
  // using OpenStreetMap's free Nominatim API (no API key required).
  const geocodeAddress = async () => {
    if (!form.address.trim()) {
      setError("Enter an address first");
      return;
    }
    setLocating(true);
    setError("");
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(
          form.address
        )}`
      );
      const data = await res.json();
      if (!data.length) {
        setError("Couldn't find that address — try adding more detail (city, landmark)");
        setLocating(false);
        return;
      }
      setLocation({ lat: data[0].lat, lng: data[0].lon });
    } catch {
      setError("Address lookup failed — check your connection and try again");
    } finally {
      setLocating(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!location.lat || !location.lng) {
      setError("Please find your location first (use the button below the address field)");
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("address", form.address);
      formData.append("incidentDate", form.incidentDate);
      formData.append("lat", location.lat);
      formData.append("lng", location.lng);
      if (image) formData.append("image", image);

      const res = await createReport(formData);
      navigate(`/report/${res.data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit report");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white rounded-2xl border border-[#dce8f5] p-8">
      <h1 className="text-2xl font-bold text-navy mb-2">Report an Issue</h1>
      <p className="text-sm text-gray-500 mb-6">
        Our AI will automatically categorize and prioritize your report.
      </p>

      {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Short title (e.g. Deep pothole on MG Road)"
          required
          className="border border-[#dce8f5] rounded-lg px-4 py-2"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
        <textarea
          placeholder="Describe the issue in detail..."
          required
          rows={4}
          className="border border-[#dce8f5] rounded-lg px-4 py-2"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />

        <div>
          <label className="text-sm text-gray-600 mb-1 block">
            When did you notice this issue?
          </label>
          <input
            type="date"
            required
            max={todayDate()}
            className="border border-[#dce8f5] rounded-lg px-4 py-2 w-full"
            value={form.incidentDate}
            onChange={(e) => setForm({ ...form, incidentDate: e.target.value })}
          />
        </div>

        <div>
          <label className="text-sm text-gray-600 mb-1 block">Location</label>
          <input
            type="text"
            placeholder="Address / landmark (e.g. Near City Hospital, MG Road, Ghaziabad)"
            required
            className="border border-[#dce8f5] rounded-lg px-4 py-2 w-full"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
          />
          <div className="flex items-center gap-3 mt-2">
            <button
              type="button"
              onClick={geocodeAddress}
              disabled={locating}
              className="text-sm bg-[#eef3fb] text-primary px-4 py-2 rounded-lg disabled:opacity-50"
            >
              {locating ? "Locating..." : "🔍 Find This Address"}
            </button>
            <button
              type="button"
              onClick={detectLocation}
              disabled={locating}
              className="text-sm bg-[#eef3fb] text-primary px-4 py-2 rounded-lg disabled:opacity-50"
            >
              📍 Use My Current Location
            </button>
          </div>
          {location.lat && (
            <p className="text-xs text-green-600 mt-2">
              ✓ Location found ({Number(location.lat).toFixed(4)}, {Number(location.lng).toFixed(4)})
            </p>
          )}
        </div>

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          className="text-sm"
        />

        <button
          type="submit"
          disabled={submitting}
          className="bg-primary text-white rounded-lg py-2 font-medium disabled:opacity-50"
        >
          {submitting ? "Submitting..." : "Submit Report"}
        </button>
      </form>
    </div>
  );
}