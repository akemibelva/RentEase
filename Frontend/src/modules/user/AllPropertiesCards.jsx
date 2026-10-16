import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Toast from "../common/Toast";
import ChatModal from "../common/ChatModal";

const AllPropertiesCards = ({ loggedIn }) => {
  const [allProperties, setAllProperties] = useState([]);
  const [filterPropertyType, setPropertyType] = useState("");
  const [filterPropertyAdType, setPropertyAdType] = useState("");
  const [filterPropertyAddress, setPropertyAddress] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [userDetails, setUserDetails] = useState({ fullName: "", phone: "" });
  const [toast, setToast] = useState({ show: false, type: "", message: "" });
  const [isChatOpen, setIsChatOpen] = useState(false);

  const showToast = (type, message) => {
    setToast({ show: true, type, message });
  };

  const getAllProperties = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8001/api/user/getAllProperties",
        { withCredentials: true }
      );
      setAllProperties(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleBooking = async (status, propertyId, ownerId) => {
    try {
      const res = await axios.post(
        `http://localhost:8001/api/user/bookinghandle/${propertyId}`,
        { userDetails, status, ownerId },
        { withCredentials: true }
      );

      if (res.data.success) {
        showToast("success", res.data.message);
        setShowModal(false);
      } else {
        showToast("error", res.data.message);
      }
    } catch (error) {
      console.log(error);
      showToast("error", "Booking failed");
    }
  };

  useEffect(() => {
    getAllProperties();
  }, []);

  const filteredProperties = allProperties
    .filter(
      (property) =>
        filterPropertyAddress === "" ||
        property.propertyAddress
          .toLowerCase()
          .includes(filterPropertyAddress.toLowerCase())
    )
    .filter(
      (property) =>
        filterPropertyAdType === "" ||
        property.propertyAdType
          .toLowerCase()
          .includes(filterPropertyAdType.toLowerCase())
    )
    .filter(
      (property) =>
        filterPropertyType === "" ||
        property.propertyType
          .toLowerCase()
          .includes(filterPropertyType.toLowerCase())
    );

  const openModal = (property) => {
    setSelectedProperty(property);
    setShowModal(true);
  };

  return (
    <div className="p-2 text-stone-800">
      {toast.show && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast({ ...toast, show: false })}
        />
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-center mb-8 bg-white p-4 rounded-2xl border border-stone-200 shadow-sm">
        <input
          type="text"
          placeholder="Search by Address..."
          value={filterPropertyAddress}
          onChange={(e) => setPropertyAddress(e.target.value)}
          className="bg-[#faf8f5] border border-stone-200 p-2.5 rounded-xl flex-1 text-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#7f5539]/30 focus:border-[#7f5539]"
        />
        <select
          value={filterPropertyAdType}
          onChange={(e) => setPropertyAdType(e.target.value)}
          className="bg-[#faf8f5] border border-stone-200 p-2.5 rounded-xl text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#7f5539]/30 focus:border-[#7f5539]"
        >
          <option value="">All Ad Types</option>
          <option value="sale">Sale</option>
          <option value="rent">Rent</option>
        </select>
        <select
          value={filterPropertyType}
          onChange={(e) => setPropertyType(e.target.value)}
          className="bg-[#faf8f5] border border-stone-200 p-2.5 rounded-xl text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#7f5539]/30 focus:border-[#7f5539]"
        >
          <option value="">All Types</option>
          <option value="commercial">Commercial</option>
          <option value="land/plot">Land/Plot</option>
          <option value="residential">Residential</option>
        </select>
      </div>

      {/* Property Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProperties.length > 0 ? (
          filteredProperties.map((property) => (
            <div
              key={property._id}
              className="bg-white border border-stone-200/80 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col group"
            >
              <div className="relative h-48 overflow-hidden bg-stone-100">
                <img
                  src={`http://localhost:8001${property.propertyImage?.[0]?.path}`}
                  alt="Property"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-[#7f5539] capitalize border border-[#7f5539]/20 shadow-sm">
                  {property.propertyAdType}
                </span>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-lg text-stone-800 line-clamp-1">{property.propertyAddress}</h3>
                  <p className="text-stone-500 text-xs font-medium uppercase tracking-wider mt-1">
                    {property.propertyType}
                  </p>
                  
                  {loggedIn && (
                    <div className="mt-3 space-y-1 text-xs text-stone-600 bg-[#faf8f5] p-3 rounded-xl border border-stone-100">
                      <p><b>Owner:</b> {property.ownerName || property.ownerContact}</p>
                      <p><b>Availability:</b> {property.isAvailable}</p>
                      <p className="text-emerald-700 font-bold text-sm mt-1">Rp {property.propertyAmt}</p>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-stone-100 space-y-2">
                  <div className="flex gap-2">
                    <Link
                      to={`/property/${property._id}`}
                      className="flex-1 text-center bg-[#faedcd] text-[#7f5539] border border-[#7f5539]/20 font-semibold py-2 rounded-xl hover:bg-[#7f5539] hover:text-white transition text-xs flex items-center justify-center"
                    >
                      View Details
                    </Link>
                    {loggedIn && (
                      <button
                        onClick={() => {
                          setSelectedProperty(property);
                          setIsChatOpen(true);
                        }}
                        className="px-3 bg-stone-100 text-stone-700 border border-stone-200 rounded-xl hover:bg-stone-200 transition text-xs font-medium flex items-center gap-1"
                        title="Chat Owner"
                      >
                        💬 Chat
                      </button>
                    )}
                  </div>

                  {property.isAvailable === "Available" ? (
                    loggedIn ? (
                      <button
                        onClick={() => openModal(property)}
                        className="w-full bg-[#7f5539] text-white font-semibold py-2.5 rounded-xl hover:bg-[#65432d] transition shadow-md shadow-[#7f5539]/20 active:scale-98 text-sm"
                      >
                        Get Info / Book
                      </button>
                    ) : (
                      <p className="text-[#7f5539] text-xs font-medium text-center pt-1">
                        Sign in to view details & book
                      </p>
                    )
                  ) : (
                    <p className="text-rose-600 text-xs font-medium text-center pt-1">Currently Unavailable</p>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-stone-400 font-medium">
            No properties available matching your search criteria.
          </div>
        )}
      </div>

      {/* Booking Modal */}
      {showModal && selectedProperty && (
        <div className="fixed inset-0 flex items-center justify-center bg-stone-900/60 z-50 backdrop-blur-sm p-4">
          <div className="bg-white p-6 rounded-2xl w-full max-w-xl relative border border-stone-200 shadow-2xl animate-slideIn">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-600 w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-sm font-bold"
            >
              ✕
            </button>
            <h3 className="text-xl font-bold mb-4 text-stone-800">Property Details</h3>
            
            <img
              src={`http://localhost:8001${selectedProperty.propertyImage?.[0]?.path}`}
              alt="Property"
              className="w-full h-48 object-cover rounded-xl mb-4 bg-stone-100"
            />
            
            <div className="grid grid-cols-2 gap-3 text-xs text-stone-600 bg-[#faf8f5] p-4 rounded-xl border border-stone-100">
              <div>
                <p><b>Owner:</b> {selectedProperty.ownerName || selectedProperty.ownerContact}</p>
                <p><b>Availability:</b> {selectedProperty.isAvailable}</p>
                <p><b>Price:</b> <span className="text-emerald-700 font-bold">Rp {selectedProperty.propertyAmt}</span></p>
              </div>
              <div>
                <p><b>Location:</b> {selectedProperty.propertyAddress}</p>
                <p><b>Type:</b> {selectedProperty.propertyType}</p>
                <p><b>Ad Type:</b> {selectedProperty.propertyAdType}</p>
              </div>
            </div>
            
            {selectedProperty.additionalInfo && (
              <p className="mt-3 text-xs text-stone-600 leading-relaxed">
                <b>Additional Info:</b> {selectedProperty.additionalInfo}
              </p>
            )}

            {/* Booking Form */}
            <form
              className="mt-5 space-y-3 pt-3 border-t border-stone-200"
              onSubmit={(e) => {
                e.preventDefault();
                handleBooking("pending", selectedProperty._id, selectedProperty.ownerId);
              }}
            >
              <h4 className="text-sm font-bold text-stone-800">Book Visit / Express Interest</h4>
              <div>
                <input
                  type="text"
                  name="fullName"
                  placeholder="Your Full Name"
                  required
                  className="bg-[#faf8f5] border border-stone-200 p-2.5 w-full rounded-xl text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#7f5539]/30 focus:border-[#7f5539]"
                  value={userDetails.fullName}
                  onChange={(e) =>
                    setUserDetails({ ...userDetails, fullName: e.target.value })
                  }
                />
              </div>
              <div>
                <input
                  type="number"
                  name="phone"
                  placeholder="Phone Number"
                  required
                  className="bg-[#faf8f5] border border-stone-200 p-2.5 w-full rounded-xl text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#7f5539]/30 focus:border-[#7f5539]"
                  value={userDetails.phone}
                  onChange={(e) =>
                    setUserDetails({ ...userDetails, phone: e.target.value })
                  }
                />
              </div>
              <button
                type="submit"
                className="w-full bg-[#7f5539] text-white font-semibold py-2.5 rounded-xl hover:bg-[#65432d] transition shadow-md shadow-[#7f5539]/20 text-xs"
              >
                Confirm Booking Request
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Floating Chat Modal */}
      <ChatModal
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        recipientId={selectedProperty?.ownerId}
        recipientName={selectedProperty?.ownerName || selectedProperty?.ownerContact || "Property Owner"}
      />
    </div>
  );
};

export default AllPropertiesCards;