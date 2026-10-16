import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../App";
import AllUsers from "./AllUsers";
import AllProperty from "./AllProperty";
import AllBookings from "./AllBookings";

const AdminHome = () => {
  const user = useContext(UserContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("users");

  const handleLogOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (!user || !user.userData) return null;

  return (
    <div className="min-h-screen bg-[#faf8f5] flex flex-col font-sans">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-[#7f5539]/10 shadow-sm py-4 px-8 flex justify-between items-center">
        <h2 className="text-2xl font-extrabold text-[#7f5539] tracking-tight flex items-center gap-2">
          <span className="bg-[#7f5539] text-white w-9 h-9 rounded-xl flex items-center justify-center font-bold text-lg shadow-md shadow-[#7f5539]/20">R</span>
          <span>Rent<span className="text-[#7f5539]">Ease</span></span>
        </h2>
        <div className="flex items-center space-x-6">
          <span className="text-stone-700 font-medium">Hi, {user.userData.name}</span>
          <button
            onClick={handleLogOut}
            className="px-4 py-2 bg-rose-600 text-white font-medium text-sm rounded-xl hover:bg-rose-700 transition shadow-sm"
          >
            Log Out
          </button>
        </div>
      </nav>

      {/* Admin Tabs */}
      <div className="max-w-6xl mx-auto w-full py-24 px-4"> 
        {/* Tabs Header */}
        <div className="flex space-x-4 mb-6 border-b border-stone-200">
          <button
            onClick={() => setActiveTab("users")}
            className={`pb-3 px-4 text-base font-semibold transition-all ${
              activeTab === "users"
                ? "border-b-2 border-[#7f5539] text-[#7f5539]"
                : "text-stone-500 hover:text-[#7f5539]"
            }`}
          >
            All Users
          </button>
          <button
            onClick={() => setActiveTab("properties")}
            className={`pb-3 px-4 text-base font-semibold transition-all ${
              activeTab === "properties"
                ? "border-b-2 border-[#7f5539] text-[#7f5539]"
                : "text-stone-500 hover:text-[#7f5539]"
            }`}
          >
            All Properties
          </button>
          <button
            onClick={() => setActiveTab("bookings")}
            className={`pb-3 px-4 text-base font-semibold transition-all ${
              activeTab === "bookings"
                ? "border-b-2 border-[#7f5539] text-[#7f5539]"
                : "text-stone-500 hover:text-[#7f5539]"
            }`}
          >
            All Bookings
          </button>
        </div>

        {/* Tab Content Panel */}
        <div className="bg-white/90 backdrop-blur-xl border border-[#7f5539]/15 rounded-2xl p-6 shadow-xl text-stone-800">
          {activeTab === "users" && <AllUsers />}
          {activeTab === "properties" && <AllProperty />}
          {activeTab === "bookings" && <AllBookings />}
        </div>
      </div>
    </div>
  );
};

export default AdminHome;