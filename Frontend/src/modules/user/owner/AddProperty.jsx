import React, { useState, useEffect } from "react";
import axios from "axios";
import { message } from "antd";
import { useNavigate } from "react-router-dom";

axios.defaults.withCredentials = true; 

function AddProperty() {
  const [image, setImage] = useState(null);
  const [propertyDetails, setPropertyDetails] = useState({
    propertyType: "residential",
    propertyAdType: "rent",
    propertyAddress: "",
    ownerContact: "",
    propertyAmt: 0,
    additionalInfo: "",
  });
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    setImage(e.target.files);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPropertyDetails((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    setPropertyDetails((prev) => ({
      ...prev,
      propertyImages: image,
    }));
  }, [image]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("propertyType", propertyDetails.propertyType);
    formData.append("propertyAdType", propertyDetails.propertyAdType);
    formData.append("propertyAddress", propertyDetails.propertyAddress);
    formData.append("ownerContact", propertyDetails.ownerContact);
    formData.append("propertyAmt", propertyDetails.propertyAmt);
    formData.append("additionalInfo", propertyDetails.additionalInfo);

    if (image) {
      for (let i = 0; i < image.length; i++) {
        formData.append("propertyImages", image[i]);
      }
    }

    try {
      const res = await axios.post(
        "http://localhost:8001/api/owner/postproperty",
        formData,
        { withCredentials: true }
      );

      if (res.data.success) {
        message.success(res.data.message);
        setPropertyDetails({
          propertyType: "residential",
          propertyAdType: "rent",
          propertyAddress: "",
          ownerContact: "",
          propertyAmt: 0,
          additionalInfo: "",
        });
        setImage(null);
      } else {
        message.error(res.data.message || "Unauthorized access");
        navigate("/login");
      }
    } catch (error) {
      console.error("Error adding property:", error);
      if (error.response && error.response.status === 401) {
        message.error("Session expired, please login again");
        navigate("/login");
      } else {
        message.error("Failed to add property");
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white/90 border border-stone-200 backdrop-blur-xl shadow-xl rounded-2xl p-8 mt-6 text-stone-800">
      <h2 className="text-2xl font-bold text-[#7f5539] mb-8 text-center tracking-tight">
        Add New Property Listing
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Row 1 */}
        <div className="grid md:grid-cols-3 gap-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1.5">
              Property Type
            </label>
            <select
              name="propertyType"
              value={propertyDetails.propertyType}
              onChange={handleChange}
              className="w-full bg-[#faf8f5] border border-stone-200 rounded-xl px-3.5 py-2.5 text-stone-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#7f5539]/30 focus:border-[#7f5539] transition-all"
            >
              <option disabled>Choose...</option>
              <option value="residential">Residential</option>
              <option value="commercial">Commercial</option>
              <option value="land/plot">Land/Plot</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1.5">
              Property Ad Type
            </label>
            <select
              name="propertyAdType"
              value={propertyDetails.propertyAdType}
              onChange={handleChange}
              className="w-full bg-[#faf8f5] border border-stone-200 rounded-xl px-3.5 py-2.5 text-stone-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#7f5539]/30 focus:border-[#7f5539] transition-all"
            >
              <option disabled>Choose...</option>
              <option value="rent">Rent</option>
              <option value="sale">Sale</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1.5">
              Property Full Address
            </label>
            <input
              type="text"
              name="propertyAddress"
              value={propertyDetails.propertyAddress}
              onChange={handleChange}
              placeholder="e.g. 123 Main St, Sector 4"
              required
              className="w-full bg-[#faf8f5] border border-stone-200 rounded-xl px-3.5 py-2.5 text-stone-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#7f5539]/30 focus:border-[#7f5539] placeholder-stone-400 transition-all"
            />
          </div>
        </div>

        {/* Row 2 */}
        <div className="grid md:grid-cols-3 gap-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1.5">
              Property Images
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              required
              onChange={handleImageChange}
              className="w-full bg-[#faf8f5] border border-stone-200 rounded-xl px-3 py-2 cursor-pointer text-stone-700 text-xs file:mr-3 file:px-3 file:py-1 file:rounded-lg file:border-0 file:bg-[#faedcd] file:text-[#7f5539] file:font-semibold hover:file:bg-[#7f5539] hover:file:text-white transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1.5">
              Owner Contact No.
            </label>
            <input
              type="tel"
              name="ownerContact"
              value={propertyDetails.ownerContact}
              onChange={handleChange}
              placeholder="+91 98765 43210"
              required
              className="w-full bg-[#faf8f5] border border-stone-200 rounded-xl px-3.5 py-2.5 text-stone-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#7f5539]/30 focus:border-[#7f5539] placeholder-stone-400 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1.5">
              Property Amount (₹)
            </label>
            <input
              type="number"
              name="propertyAmt"
              value={propertyDetails.propertyAmt}
              onChange={handleChange}
              placeholder="0"
              required
              className="w-full bg-[#faf8f5] border border-stone-200 rounded-xl px-3.5 py-2.5 text-stone-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#7f5539]/30 focus:border-[#7f5539] placeholder-stone-400 transition-all"
            />
          </div>
        </div>

        {/* Row 3 */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1.5">
            Additional Details for the Property
          </label>
          <textarea
            name="additionalInfo"
            value={propertyDetails.additionalInfo}
            onChange={handleChange}
            rows={4}
            placeholder="Mention amenities, deposit requirement, furnished status..."
            className="w-full bg-[#faf8f5] border border-stone-200 rounded-xl px-3.5 py-2.5 text-stone-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#7f5539]/30 focus:border-[#7f5539] placeholder-stone-400 transition-all"
          />
        </div>

        {/* Submit */}
        <div className="text-right pt-2">
          <button
            type="submit"
            className="bg-[#7f5539] text-white font-semibold px-6 py-2.5 rounded-xl shadow-md shadow-[#7f5539]/20 hover:bg-[#65432d] transition-all duration-200 text-sm transform active:scale-98"
          >
            Submit Listing
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddProperty;