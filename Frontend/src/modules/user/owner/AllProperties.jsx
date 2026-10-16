import { message } from "antd";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const OwnerAllProperties = () => {
  const [image, setImage] = useState(null);
  const [editingPropertyId, setEditingPropertyId] = useState(null);
  const [editingPropertyData, setEditingPropertyData] = useState({
    propertyType: "",
    propertyAdType: "",
    propertyAddress: "",
    ownerContact: "",
    propertyAmt: 0,
    additionalInfo: "",
  });
  const [allProperties, setAllProperties] = useState([]);
  const [show, setShow] = useState(false);
  const navigate = useNavigate();

  const handleClose = () => setShow(false);

  const handleShow = (property) => {
    setEditingPropertyId(property._id);
    setEditingPropertyData(property);
    setShow(true);
  };

  const getAllProperty = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8001/api/owner/getallproperties",
        { withCredentials: true }
      );
      if (response.data.success) {
        setAllProperties(response.data.data);
      } else {
        message.error("Unauthorized access");
        navigate("/login");
      }
    } catch (error) {
      console.log(error);
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditingPropertyData((prev) => ({ ...prev, [name]: value }));
  };

  const saveChanges = async (propertyId, status) => {
    try {
      const formData = new FormData();
      Object.entries(editingPropertyData).forEach(([key, value]) =>
        formData.append(key, value)
      );
      if (image) formData.append("propertyImage", image);
      formData.append("isAvailable", status);

      const res = await axios.patch(
        `http://localhost:8001/api/owner/updateproperty/${propertyId}`,
        formData,
        { withCredentials: true }
      );

      if (res.data.success) {
        message.success(res.data.message);
        handleClose();
        getAllProperty();
      } else {
        message.error(res.data.message || "Unauthorized access");
        navigate("/login");
      }
    } catch (error) {
      console.log(error);

      if (error.response && error.response.status === 401) {
        message.error("Session expired, please login again");
        navigate("/login");
      } else {
        message.error("Failed to save changes");
      }
    }
  };

  const handleDelete = async (propertyId) => {
    if (window.confirm("Are you sure you want to delete this property listing?")) {
      try {
        const response = await axios.delete(
          `http://localhost:8001/api/owner/deleteproperty/${propertyId}`,
          { withCredentials: true }
        );

        if (response.data.success) {
          message.success(response.data.message);
          getAllProperty();
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
          message.error("Failed to delete property");
        }
      }
    }
  };

  return (
    <div className="p-2">
      <div className="overflow-x-auto rounded-xl shadow-md border border-stone-200 bg-white">
        <table className="w-full text-sm text-left text-stone-800">
          <thead className="bg-[#7f5539] text-white">
            <tr>
              <th className="px-4 py-3 font-semibold">Property ID</th>
              <th className="px-4 py-3 text-center font-semibold">Type</th>
              <th className="px-4 py-3 text-center font-semibold">Ad Type</th>
              <th className="px-4 py-3 text-center font-semibold">Address</th>
              <th className="px-4 py-3 text-center font-semibold">Owner Contact</th>
              <th className="px-4 py-3 text-center font-semibold">Amount</th>
              <th className="px-4 py-3 text-center font-semibold">Availability</th>
              <th className="px-4 py-3 text-center font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-200">
            {allProperties.map((property, idx) => (
              <tr
                key={property._id}
                className={`transition duration-150 ${
                  idx % 2 === 0 ? "bg-[#faf8f5]" : "bg-white"
                } hover:bg-[#faedcd]/40`}
              >
                <td className="px-4 py-3 font-mono text-xs text-stone-600">{property._id}</td>
                <td className="px-4 py-3 text-center capitalize text-[#7f5539] font-medium">{property.propertyType}</td>
                <td className="px-4 py-3 text-center capitalize text-stone-600">{property.propertyAdType}</td>
                <td className="px-4 py-3 text-center text-stone-800">{property.propertyAddress}</td>
                <td className="px-4 py-3 text-center text-stone-600">{property.ownerContact}</td>
                <td className="px-4 py-3 text-center font-bold text-emerald-700">₹{property.propertyAmt}</td>
                <td className="px-4 py-3 text-center">
                  <span
                    className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${
                      property.isAvailable === "Available"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-rose-100 text-rose-800"
                    }`}
                  >
                    {property.isAvailable}
                  </span>
                </td>
                <td className="px-4 py-3 flex gap-2 justify-center">
                  <button
                    onClick={() => handleShow(property)}
                    className="px-3 py-1 text-xs border border-[#7f5539] text-[#7f5539] font-semibold rounded-lg hover:bg-[#faedcd]/60 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(property._id)}
                    className="px-3 py-1 text-xs border border-rose-500 text-rose-600 font-semibold rounded-lg hover:bg-rose-50 transition"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {show && (
        <div className="fixed inset-0 flex items-center justify-center bg-stone-900/60 backdrop-blur-sm z-50 p-4">
          <div className="bg-white border border-stone-200 text-stone-800 w-full max-w-xl p-6 rounded-2xl shadow-2xl">
            <h3 className="text-xl font-bold mb-5 text-[#7f5539]">Edit Property Listing</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                saveChanges(editingPropertyId, editingPropertyData.isAvailable);
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block font-semibold text-stone-600 mb-1">Property Type</label>
                <input
                  type="text"
                  name="propertyType"
                  value={editingPropertyData.propertyType}
                  onChange={handleChange}
                  className="border border-stone-200 bg-[#faf8f5] text-stone-800 px-3 py-2 w-full rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7f5539]/30 focus:border-[#7f5539]"
                />
              </div>
              <div>
                <label className="block font-semibold text-stone-600 mb-1">Ad Type</label>
                <input
                  type="text"
                  name="propertyAdType"
                  value={editingPropertyData.propertyAdType}
                  onChange={handleChange}
                  className="border border-stone-200 bg-[#faf8f5] text-stone-800 px-3 py-2 w-full rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7f5539]/30 focus:border-[#7f5539]"
                />
              </div>
              <div>
                <label className="block font-semibold text-stone-600 mb-1">Address</label>
                <input
                  type="text"
                  name="propertyAddress"
                  value={editingPropertyData.propertyAddress}
                  onChange={handleChange}
                  className="border border-stone-200 bg-[#faf8f5] text-stone-800 px-3 py-2 w-full rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7f5539]/30 focus:border-[#7f5539]"
                />
              </div>
              <div>
                <label className="block font-semibold text-stone-600 mb-1">Owner Contact</label>
                <input
                  type="text"
                  name="ownerContact"
                  value={editingPropertyData.ownerContact}
                  onChange={handleChange}
                  className="border border-stone-200 bg-[#faf8f5] text-stone-800 px-3 py-2 w-full rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7f5539]/30 focus:border-[#7f5539]"
                />
              </div>
              <div>
                <label className="block font-semibold text-stone-600 mb-1">Amount (₹)</label>
                <input
                  type="number"
                  name="propertyAmt"
                  value={editingPropertyData.propertyAmt}
                  onChange={handleChange}
                  className="border border-stone-200 bg-[#faf8f5] text-stone-800 px-3 py-2 w-full rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7f5539]/30 focus:border-[#7f5539]"
                />
              </div>
              <div>
                <label className="block font-semibold text-stone-600 mb-1">Additional Info</label>
                <textarea
                  name="additionalInfo"
                  value={editingPropertyData.additionalInfo}
                  onChange={handleChange}
                  rows={3}
                  className="border border-stone-200 bg-[#faf8f5] text-stone-800 px-3 py-2 w-full rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7f5539]/30 focus:border-[#7f5539]"
                />
              </div>
              <div>
                <label className="block font-semibold text-stone-600 mb-1">Replace Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="border border-stone-200 bg-[#faf8f5] text-stone-800 px-3 py-1.5 w-full rounded-xl cursor-pointer file:mr-3 file:px-2.5 file:py-1 file:rounded-lg file:border-0 file:bg-[#faedcd] file:text-[#7f5539] file:font-semibold"
                />
              </div>

              <div className="flex justify-end gap-3 mt-5 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 border border-stone-300 font-semibold text-stone-600 rounded-xl hover:bg-stone-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#7f5539] text-white font-semibold rounded-xl hover:bg-[#65432d] transition shadow-md shadow-[#7f5539]/20"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OwnerAllProperties;