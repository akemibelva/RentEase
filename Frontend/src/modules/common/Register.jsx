import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Toast from "../common/Toast";

axios.defaults.withCredentials = true;

const Register = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [toast, setToast] = useState({ show: false, type: "", message: "" });
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    type: "",
  });

  const showToast = (type, message) => {
    setToast({ show: true, type, message });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!data.name || !data.email || !data.password || !data.type) {
      return showToast("error", "Please fill all fields");
    }

    try {
      const response = await axios.post(
        "http://localhost:8001/api/user/register",
        data,
        { withCredentials: true }
      );

      if (response.data.success) {
        showToast("success", response.data.message);
        setTimeout(() => navigate("/login"), 1000);
      } else {
        showToast("error", response.data.message);
      }
    } catch (error) {
      showToast("error", error.response?.data?.message || "Registration failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] relative overflow-hidden flex flex-col font-sans">
      {/* Background Decor */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-[#faedcd]/60 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#7f5539]/10 rounded-full blur-3xl pointer-events-none"></div>

      {toast.show && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast({ ...toast, show: false })}
        />
      )}

      {/* Navbar */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-[#7f5539]/10 shadow-sm py-4 px-8 flex justify-between items-center transition-all duration-300">
        <Link to="/" className="text-2xl font-extrabold text-[#7f5539] tracking-tight flex items-center gap-2">
          <span className="bg-[#7f5539] text-white w-9 h-9 rounded-xl flex items-center justify-center font-bold text-lg shadow-md shadow-[#7f5539]/20">R</span>
          <span>Rent<span className="text-[#7f5539]">Ease</span></span>
        </Link>
        <div className="space-x-6 text-sm font-medium flex items-center">
          <Link
            to="/"
            className={`transition-colors ${
              location.pathname === "/"
                ? "text-[#7f5539] font-bold border-b-2 border-[#7f5539] pb-0.5"
                : "text-stone-600 hover:text-[#7f5539]"
            }`}
          >
            Home
          </Link>
          <Link
            to="/login"
            className={`transition-colors ${
              location.pathname === "/login"
                ? "text-[#7f5539] font-bold border-b-2 border-[#7f5539] pb-0.5"
                : "text-stone-600 hover:text-[#7f5539]"
            }`}
          >
            Login
          </Link>
          <Link
            to="/register"
            className={`px-5 py-2.5 rounded-xl shadow-md shadow-[#7f5539]/20 transition-all transform active:scale-95 text-white ${
              location.pathname === "/register"
                ? "bg-[#65432d] ring-2 ring-[#7f5539] ring-offset-2"
                : "bg-[#7f5539] hover:bg-[#65432d]"
            }`}
          >
            Register
          </Link>
        </div>
      </nav>

      {/* Register Form */}
      <div className="flex-grow flex justify-center items-center px-4 pt-24 pb-12 z-10">
        <div className="bg-white/90 border border-[#7f5539]/15 backdrop-blur-xl shadow-xl rounded-2xl w-full max-w-md p-8 transition-all hover:shadow-2xl">
          <div className="text-center mb-8">
            <div className="mx-auto w-14 h-14 flex items-center justify-center rounded-2xl bg-[#faedcd] text-[#7f5539] text-2xl shadow-inner border border-[#7f5539]/20">
              📝
            </div>
            <h1 className="text-2xl font-bold mt-4 text-stone-800 tracking-tight">Create Account</h1>
            <p className="text-stone-500 text-sm mt-1">Join RentEase to start renting or listing properties</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-stone-600 uppercase tracking-wider mb-1.5">Full Name</label>
              <input
                type="text"
                name="name"
                value={data.name}
                onChange={handleChange}
                placeholder="John Doe"
                className="w-full px-4 py-3 bg-[#faf8f5] border border-stone-200 text-stone-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7f5539]/30 focus:border-[#7f5539] placeholder-stone-400 transition-all text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-600 uppercase tracking-wider mb-1.5">Email Address</label>
              <input
                type="email"
                name="email"
                value={data.email}
                onChange={handleChange}
                placeholder="name@example.com"
                className="w-full px-4 py-3 bg-[#faf8f5] border border-stone-200 text-stone-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7f5539]/30 focus:border-[#7f5539] placeholder-stone-400 transition-all text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-600 uppercase tracking-wider mb-1.5">Password</label>
              <input
                type="password"
                name="password"
                value={data.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-[#faf8f5] border border-stone-200 text-stone-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7f5539]/30 focus:border-[#7f5539] placeholder-stone-400 transition-all text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-600 uppercase tracking-wider mb-1.5">User Role</label>
              <select
                name="type"
                value={data.type}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-[#faf8f5] border border-stone-200 text-stone-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7f5539]/30 focus:border-[#7f5539] transition-all text-sm cursor-pointer"
              >
                <option value="">Select Role</option>
                <option value="Renter">Renter (Looking to Rent)</option>
                <option value="Owner">Owner (Listing Property)</option>
                <option value="Admin">Admin</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-[#7f5539] text-white py-3 rounded-xl font-semibold shadow-md shadow-[#7f5539]/20 hover:bg-[#65432d] transition-all duration-200 transform active:scale-98 mt-2"
            >
              Create Account
            </button>

            <div className="text-center text-sm text-stone-500 mt-6 pt-2 border-t border-stone-100">
              Already have an account?{" "}
              <Link to="/login" className="text-[#7f5539] hover:underline font-semibold transition-colors">
                Sign In
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;