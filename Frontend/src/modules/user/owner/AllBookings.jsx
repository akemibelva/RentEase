import { message } from "antd";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

axios.defaults.withCredentials = true; 

const OwnerAllBookings = ({ onOpenChat }) => {
  const [allBookings, setAllBookings] = useState([]);
  const navigate = useNavigate();

  const getAllProperty = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8001/api/owner/getallbookings",
        { withCredentials: true }
      );

      if (response.data.success) {
        setAllBookings(response.data.data);
      } else {
        message.error(response.data.message || "Unauthorized access");
        navigate("/login"); 
      }
    } catch (error) {
      console.log(error);
      if (error.response && error.response.status === 401) {
        message.error("Session expired, please login again");
        navigate("/login");
      } else {
        message.error("Failed to fetch bookings");
      }
    }
  };

  useEffect(() => {
    getAllProperty();
  }, []);

  const handleStatus = async (bookingId, propertyId, status) => {
    try {
      const res = await axios.post(
        "http://localhost:8001/api/owner/handlebookingstatus",
        { bookingId, propertyId, status },
        { withCredentials: true }
      );

      if (res.data.success) {
        message.success(res.data.message);
        getAllProperty();
      } else {
        message.error("Something went wrong");
      }
    } catch (error) {
      console.log(error);
      message.error("Failed to update booking status");
    }
  };

  return (
    <div className="overflow-x-auto mt-2">
      <table className="min-w-full border border-stone-200 bg-white shadow-md rounded-xl overflow-hidden text-sm">
        <thead className="bg-[#7f5539] text-white">
          <tr>
            <th className="py-3 px-4 text-left font-semibold">Booking ID</th>
            <th className="py-3 px-4 text-center font-semibold">Property ID</th>
            <th className="py-3 px-4 text-center font-semibold">Tenant Name</th>
            <th className="py-3 px-4 text-center font-semibold">Tenant Phone</th>
            <th className="py-3 px-4 text-center font-semibold">Booking Status</th>
            <th className="py-3 px-4 text-center font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-stone-200">
          {allBookings.length > 0 ? (
            allBookings.map((booking, idx) => (
              <tr
                key={booking._id}
                className={`transition duration-150 ${
                  idx % 2 === 0 ? "bg-[#faf8f5]" : "bg-white"
                } hover:bg-[#faedcd]/40`}
              >
                <td className="py-3 px-4 font-mono text-xs text-stone-700">{booking._id}</td>
                <td className="py-3 px-4 text-center font-mono text-xs text-[#7f5539] font-medium">{booking.propertyId}</td>
                <td className="py-3 px-4 text-center font-medium text-stone-800">{booking.userName}</td>
                <td className="py-3 px-4 text-center text-stone-600">{booking.phone}</td>
                <td className="py-3 px-4 text-center">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                      booking.bookingStatus === "booked" || booking.bookingStatus === "Confirmed"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-[#faedcd] text-[#7f5539]"
                    }`}
                  >
                    {booking.bookingStatus}
                  </span>
                </td>
                <td className="py-3 px-4 text-center">
                  <div className="flex items-center justify-center gap-2">
                    {booking.bookingStatus === "pending" ? (
                      <button
                        onClick={() =>
                          handleStatus(booking._id, booking.propertyId, "booked")
                        }
                        className="px-3 py-1.5 text-xs font-semibold bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg transition shadow-sm"
                      >
                        Mark Booked
                      </button>
                    ) : (
                      <button
                        onClick={() =>
                          handleStatus(booking._id, booking.propertyId, "pending")
                        }
                        className="px-3 py-1.5 text-xs font-semibold bg-[#7f5539] hover:bg-[#65432d] text-white rounded-lg transition shadow-sm"
                      >
                        Mark Pending
                      </button>
                    )}

                    <button
                      onClick={() => onOpenChat && onOpenChat(booking.userID, booking.userName)}
                      className="px-3 py-1.5 text-xs font-semibold bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-300 rounded-lg transition flex items-center gap-1 shadow-sm"
                      title="Chat dengan Tenant"
                    >
                      💬 Chat
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={6}
                className="py-6 px-4 text-center text-stone-400 italic"
              >
                No bookings available at the moment
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default OwnerAllBookings;