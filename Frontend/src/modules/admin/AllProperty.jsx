import React, { useState, useEffect } from "react";
import axios from "axios";
import { message } from "antd";
import { useNavigate } from "react-router-dom";

axios.defaults.withCredentials = true;

const AdminAllProperty = () => {
  const [allProperties, setAllProperties] = useState([]);
  const navigate = useNavigate();

  const getAllProperty = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8001/api/admin/getallproperties",
        { withCredentials: true }
      );

      if (response.data.success) {
        setAllProperties(response.data.data);
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
        message.error("Failed to fetch Property");
      }
    }
  };

  useEffect(() => {
    getAllProperty();
  }, []);

  return (
    <div className="overflow-x-auto mt-2">
      <table className="min-w-full border border-stone-200 bg-white shadow-md rounded-xl overflow-hidden text-sm">
        <thead className="bg-[#7f5539] text-white">
          <tr>
            <th className="py-3 px-4 text-left font-semibold">Property ID</th>
            <th className="py-3 px-4 text-center font-semibold">Owner ID</th>
            <th className="py-3 px-4 text-center font-semibold">Property Type</th>
            <th className="py-3 px-4 text-center font-semibold">Property Ad Type</th>
            <th className="py-3 px-4 text-center font-semibold">Property Address</th>
            <th className="py-3 px-4 text-center font-semibold">Owner Contact</th>
            <th className="py-3 px-4 text-center font-semibold">Property Amt</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-stone-200">
          {allProperties.length > 0 ? (
            allProperties.map((property, index) => (
              <tr
                key={property._id}
                className={`transition duration-150 ${
                  index % 2 === 0 ? "bg-[#faf8f5]" : "bg-white"
                } hover:bg-[#faedcd]/40`}
              >
                <td className="py-3 px-4 text-stone-700 font-mono text-xs">
                  {property._id}
                </td>
                <td className="py-3 px-4 text-center text-stone-600 font-mono text-xs">
                  {property.ownerId}
                </td>
                <td className="py-3 px-4 text-center text-[#7f5539] font-medium">
                  {property.propertyType}
                </td>
                <td className="py-3 px-4 text-center text-stone-600 capitalize">
                  {property.propertyAdType || "N/A"}
                </td>
                <td className="py-3 px-4 text-center text-stone-800">
                  {property.propertyAddress}
                </td>
                <td className="py-3 px-4 text-center text-stone-600">
                  {property.ownerContact}
                </td>
                <td className="py-3 px-4 text-center font-bold text-emerald-700">
                  ₹{property.propertyAmt}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan="7"
                className="text-center py-6 text-stone-400 font-medium italic"
              >
                No properties found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminAllProperty;