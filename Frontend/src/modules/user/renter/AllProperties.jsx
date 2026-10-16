import React, { useState, useEffect } from "react";
import axios from "axios";
import { message } from "antd";
import { useNavigate } from "react-router-dom";

const RenterAllProperty = () => {
  const [allProperties, setAllProperties] = useState([]);
  const navigate = useNavigate();

  const getAllProperty = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8001/api/user/getallbookings",
        { withCredentials: true }
      );

      if (response.data.success) {
        setAllProperties(response.data.data);
      } else {
        message.error(response.data.message);
        navigate("/login");
      }
    } catch (error) {
      console.error(error);
      if (error.response && error.response.status === 401) {
        message.error("Session expired, please login again");
        navigate("/login");
      } else {
        message.error("Failed to fetch properties");
      }
    }
  };

  useEffect(() => {
    getAllProperty();
  }, []);

  return (
    <div className="overflow-x-auto bg-white border border-stone-200 shadow-md rounded-2xl p-6">
      <h2 className="text-xl font-bold text-[#7f5539] mb-4">
        All My Bookings
      </h2>
      <table className="min-w-full border border-stone-200 text-sm rounded-xl overflow-hidden">
        <thead className="bg-[#7f5539] text-white">
          <tr>
            <th className="px-4 py-3 text-left font-semibold">Booking ID</th>
            <th className="px-4 py-3 text-left font-semibold">Property ID</th>
            <th className="px-4 py-3 text-center font-semibold">Tenant Name</th>
            <th className="px-4 py-3 text-center font-semibold">Phone</th>
            <th className="px-4 py-3 text-center font-semibold">Booking Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-stone-200">
          {allProperties.length > 0 ? (
            allProperties.map((booking, index) => (
              <tr
                key={booking._id}
                className={`transition duration-150 ${
                  index % 2 === 0 ? "bg-[#faf8f5]" : "bg-white"
                } hover:bg-[#faedcd]/40`}
              >
                <td className="px-4 py-3 font-mono text-xs text-stone-700">{booking._id}</td>
                <td className="px-4 py-3 font-mono text-xs text-[#7f5539] font-medium">{booking.propertyId}</td>
                <td className="px-4 py-3 text-center text-stone-800 font-medium">
                  {booking.userName}
                </td>
                <td className="px-4 py-3 text-center text-stone-600">
                  {booking.phone}
                </td>
                <td className="px-4 py-3 text-center">
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
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan="5"
                className="text-center py-6 text-stone-400 font-medium italic"
              >
                No bookings found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default RenterAllProperty;