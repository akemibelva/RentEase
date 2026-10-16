import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import ChatModal from "./ChatModal";

const PropertyDetail = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    const fetchPropertyDetail = async () => {
      try {
        const res = await axios.get(`http://localhost:8001/api/user/getProperty/${id}`);
        if (res.data.success) {
          setProperty(res.data.data);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchPropertyDetail();
  }, [id]);

  if (!property) {
    return (
      <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center text-stone-500 font-medium">
        Loading property details...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf8f5] font-sans text-stone-800 pb-12">
      {/* Navbar */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-[#7f5539]/10 py-4 px-8 flex justify-between items-center sticky top-0 z-40">
        <Link to="/" className="text-2xl font-extrabold text-[#7f5539] tracking-tight flex items-center gap-2">
          <span className="bg-[#7f5539] text-white w-9 h-9 rounded-xl flex items-center justify-center font-bold text-lg shadow-md">R</span>
          <span>Rent<span className="text-[#7f5539]">Ease</span></span>
        </Link>
        <Link to="/" className="text-sm font-semibold text-stone-600 hover:text-[#7f5539]">
          ← Back to Listings
        </Link>
      </nav>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto mt-8 px-4">
        <div className="bg-white border border-stone-200 rounded-2xl shadow-xl overflow-hidden p-6">
          <div className="h-80 bg-stone-100 rounded-xl overflow-hidden mb-6">
            <img
              src={`http://localhost:8001${property.propertyImage?.[0]?.path}`}
              alt="Property"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-stone-200 pb-4 mb-4 gap-4">
            <div>
              <span className="inline-block px-3 py-1 bg-[#faedcd] text-[#7f5539] font-semibold text-xs rounded-full uppercase mb-2">
                {property.propertyAdType} • {property.propertyType}
              </span>
              <h1 className="text-2xl font-bold text-stone-800">{property.propertyAddress}</h1>
            </div>
            <div className="text-right">
              <span className="text-xs text-stone-500 block">Rent / Price</span>
              <span className="text-2xl font-bold text-emerald-700">Rp {property.propertyAmt}</span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 bg-[#faf8f5] p-4 rounded-xl border border-stone-100 text-sm mb-6">
            <div>
              <p className="mb-2"><b>Owner Contact:</b> {property.ownerName || property.ownerContact}</p>
              <p><b>Availability:</b> <span className="text-emerald-700 font-semibold">{property.isAvailable}</span></p>
            </div>
            <div>
              <p className="mb-2"><b>Type:</b> {property.propertyType}</p>
              <p><b>Ad Option:</b> {property.propertyAdType}</p>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="font-bold text-stone-800 text-sm mb-2">Additional Description & Features</h3>
            <p className="text-stone-600 text-sm leading-relaxed">
              {property.additionalInfo || "No additional information provided."}
            </p>
          </div>

          <div className="flex gap-4 pt-4 border-t border-stone-200">
            <button
              onClick={() => setIsChatOpen(true)}
              className="flex-1 bg-[#faedcd] text-[#7f5539] font-semibold py-3 rounded-xl border border-[#7f5539]/20 hover:bg-[#7f5539] hover:text-white transition text-sm flex items-center justify-center gap-2"
            >
              💬 Chat with Owner
            </button>
          </div>
        </div>
      </div>

      {/* Floating Chat Modal */}
      <ChatModal
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        recipientId={property.ownerId}
        recipientName={property.ownerName || property.ownerContact || "Property Owner"}
      />
    </div>
  );
};

export default PropertyDetail;