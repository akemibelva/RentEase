import React, { useState, useEffect } from "react";
import axios from "axios";
import Toast from "../common/Toast";
import { useNavigate } from "react-router-dom";
import { message } from "antd";

axios.defaults.withCredentials = true;

const AllUsers = () => {
  const [allUser, setAllUser] = useState([]);
  const [toast, setToast] = useState({ show: false, type: "", message: "" });
  
  // State untuk pencarian dan filter role
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");

  const navigate = useNavigate();

  const showToast = (type, message) => {
    setToast({ show: true, type, message });
  };

  useEffect(() => {
    getAllUser();
  }, []);

  const getAllUser = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8001/api/admin/getallusers"
      );
      if (response.data.success) {
        setAllUser(response.data.data);
      } else {
        message.error(response.data.message || "Unauthorized access");
        navigate("/login"); 
      }
    } catch (error) {
      console.error(error);
      if (error.response && error.response.status === 401) {
        message.error("Session expired, please login again");
        navigate("/login");
      } else {
        message.error("Failed to fetch Users");
      }
    }
  };

  const handleStatus = async (userid, status) => {
    try {
      const res = await axios.post(
        "http://localhost:8001/api/admin/handlestatus",
        { userid, status }
      );

      if (res.data.success) {
        showToast("success", "Status updated successfully");
        getAllUser();
      } else {
        showToast("error", res.data.message);
      }
    } catch (error) {
      console.error(error);
      showToast("error", "Failed to update status");
    }
  };

  // Logika Filter dan Search
  const filteredUsers = allUser.filter((user) => {
    const matchesSearch = user.name
      ? user.name.toLowerCase().includes(searchTerm.toLowerCase())
      : false;

    const matchesRole =
      roleFilter === "All" || user.type?.toLowerCase() === roleFilter.toLowerCase();

    return matchesSearch && matchesRole;
  });

  return (
    <div className="relative mt-2">
      {toast.show && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast({ ...toast, show: false })}
        />
      )}

      {/* Control Bar: Search Input & Role Filter Dropdown */}
      <div className="flex flex-col md:flex-row gap-3 justify-between items-center mb-6">
        {/* Search Bar */}
        <div className="w-full md:w-1/2 relative">
          <input
            type="text"
            placeholder="Search user by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2.5 bg-[#faf8f5] border border-stone-300 rounded-xl text-stone-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#7f5539]/30 focus:border-[#7f5539] transition-all"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-2.5 text-stone-400 hover:text-stone-600 text-xs font-bold"
            >
              ✕
            </button>
          )}
        </div>

        {/* Filter Dropdown */}
        <div className="w-full md:w-auto flex items-center gap-2">
          <label className="text-xs font-semibold text-stone-600 uppercase tracking-wider whitespace-nowrap">
            Role Filter:
          </label>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-4 py-2 bg-[#faf8f5] border border-stone-300 rounded-xl text-stone-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#7f5539]/30 focus:border-[#7f5539] cursor-pointer"
          >
            <option value="All">All Roles</option>
            <option value="Renter">Renter</option>
            <option value="Owner">Owner</option>
            <option value="Admin">Admin</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-stone-200 bg-white shadow-md rounded-xl overflow-hidden text-sm">
          <thead className="bg-[#7f5539] text-white">
            <tr>
              <th className="py-3 px-4 text-left font-semibold">User ID</th>
              <th className="py-3 px-4 text-center font-semibold">Name</th>
              <th className="py-3 px-4 text-center font-semibold">Email</th>
              <th className="py-3 px-4 text-center font-semibold">Type</th>
              <th className="py-3 px-4 text-center font-semibold">
                Granted (Owners Only)
              </th>
              <th className="py-3 px-4 text-center font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-200">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user, index) => (
                <tr
                  key={user._id}
                  className={`transition duration-150 ${
                    index % 2 === 0 ? "bg-[#faf8f5]" : "bg-white"
                  } hover:bg-[#faedcd]/40`}
                >
                  <td className="py-3 px-4 text-stone-700 font-mono text-xs">
                    {user._id}
                  </td>
                  <td className="py-3 px-4 text-center text-stone-800 font-medium">
                    {user.name}
                  </td>
                  <td className="py-3 px-4 text-center text-stone-600">
                    {user.email}
                  </td>
                  <td className="py-3 px-4 text-center font-medium text-[#7f5539]">
                    {user.type}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${
                        user.granted === "granted"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-rose-100 text-rose-800"
                      }`}
                    >
                      {user.granted || "N/A"}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    {user.type === "Owner" && user.granted === "ungranted" && (
                      <button
                        onClick={() => handleStatus(user._id, "granted")}
                        className="px-3 py-1.5 bg-emerald-700 text-white font-medium text-xs rounded-lg hover:bg-emerald-800 transition shadow-sm"
                      >
                        Grant
                      </button>
                    )}
                    {user.type === "Owner" && user.granted === "granted" && (
                      <button
                        onClick={() => handleStatus(user._id, "ungranted")}
                        className="px-3 py-1.5 bg-rose-600 text-white font-medium text-xs rounded-lg hover:bg-rose-700 transition shadow-sm"
                      >
                        Ungrant
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="6"
                  className="text-center py-6 text-stone-400 font-medium italic"
                >
                  No users found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllUsers;