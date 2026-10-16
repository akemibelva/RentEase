import React, { useState, useEffect } from "react";
import axios from "axios";
import { message } from "antd";
import { useNavigate } from "react-router-dom";

axios.defaults.withCredentials = true;

const AdminAllBookings = () => {
  const [allBookings, setAllBookings] = useState([]);
  const navigate = useNavigate();

  const getAllBooking = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8001/api/admin/getallbookings",
        { withCredentials: true }
      );

      if (response.data.success) {
        setAllBookings(response.data.data);
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
        message.error("Failed to fetch bookings");
      }
    }
  };

  useEffect(() => {
    getAllBooking();
  }, []);

  return (
    <div className="overflow-x-auto mt-2">
      <table className="min-w-full border border-stone-200 bg-white shadow-md rounded-xl overflow-hidden text-sm">
        <thead className="bg-[#7f5539] text-white">
          <tr>
            <th className="py-3 px-4 text-left font-semibold">Booking ID</th>
            <th className="py-3 px-4 text-center font-semibold">Owner ID</th>
            <th className="py-3 px-4 text-center font-semibold">Property ID</th>
            <th className="py-3 px-4 text-center font-semibold">Tenant ID</th>
            <th className="py-3 px-4 text-center font-semibold">Tenant Name</th>
            <th className="py-3 px-4 text-center font-semibold">Tenant Contact</th>
            <th className="py-3 px-4 text-center font-semibold">Booking Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-stone-200">
          {allBookings.length > 0 ? (
            allBookings.map((booking, index) => (
              <tr
                key={booking._id}
                className={`transition duration-150 ${
                  index % 2 === 0 ? "bg-[#faf8f5]" : "bg-white"
                } hover:bg-[#faedcd]/40`}
              >
                <td className="py-3 px-4 text-stone-700 font-mono text-xs">
                  {booking._id}
                </td>
                <td className="py-3 px-4 text-center text-stone-600 font-mono text-xs">
                  {booking.ownerID}
                </td>
                <td className="py-3 px-4 text-center text-[#7f5539] font-medium font-mono text-xs">
                  {booking.propertyId}
                </td>
                <td className="py-3 px-4 text-center text-stone-600 font-mono text-xs">
                  {booking.userID}
                </td>
                <td className="py-3 px-4 text-center text-stone-800 font-medium">
                  {booking.userName}
                </td>
                <td className="py-3 px-4 text-center text-stone-600">
                  {booking.phone}
                </td>
                <td className="py-3 px-4 text-center">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                      booking.bookingStatus === "Confirmed" || booking.bookingStatus === "booked"
                        ? "bg-emerald-100 text-emerald-800"
                        : booking.bookingStatus === "Pending" || booking.bookingStatus === "pending"
                        ? "bg-[#faedcd] text-[#7f5539]"
                        : "bg-rose-100 text-rose-800"
                    }`}
                  >
                    {booking.bookingStatus}
                  </span>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan="7"
                className="text-center py-6 text-stone-400 font-medium italic"
              >
                No bookings found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminAllBookings;