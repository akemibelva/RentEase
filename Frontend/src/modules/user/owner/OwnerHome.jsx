import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { UserContext } from "../../../App";
import AddProperty from "./AddProperty";
import AllProperties from "./AllProperties";
import AllBookings from "./AllBookings";
import OwnerMessages from "./OwnerMessages";
import ChatModal from "../../common/ChatModal";

const OwnerHome = () => {
  const user = useContext(UserContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);

  // State modal chat global
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatRecipient, setChatRecipient] = useState({ id: null, name: "" });

  if (!user || !user.userData) return null;

  const handleLogOut = () => {
    document.cookie =
      "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    localStorage.removeItem("user");
    navigate("/login");
  };

  const openChat = (recipientId, recipientName) => {
    setChatRecipient({ id: recipientId, name: recipientName });
    setIsChatOpen(true);
  };

  const tabs = [
    { name: "Add Property", component: <AddProperty /> },
    { name: "All Properties", component: <AllProperties /> },
    { name: "All Bookings", component: <AllBookings onOpenChat={openChat} /> },
    { name: "Messages", component: <OwnerMessages onOpenChat={openChat} /> },
  ];

  return (
    <div className="min-h-screen bg-[#faf8f5] text-stone-800 font-sans relative">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#7f5539]/10 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="text-2xl font-extrabold text-[#7f5539] tracking-tight flex items-center gap-2">
            <span className="bg-[#7f5539] text-white w-9 h-9 rounded-xl flex items-center justify-center font-bold text-lg shadow-md shadow-[#7f5539]/20">R</span>
            <span>Rent<span className="text-[#7f5539]">Ease</span></span>
          </Link>
          <div className="flex items-center gap-6">
            <h5 className="font-medium text-stone-700 text-sm">
              Hi, <span className="font-bold text-[#7f5539]">{user.userData.name}</span>
            </h5>
            <button
              onClick={handleLogOut}
              className="px-4 py-2 text-sm bg-rose-600 text-white font-medium rounded-xl shadow-sm hover:bg-rose-700 transition duration-200"
            >
              Log Out
            </button>
          </div>
        </div>
      </nav>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Navigation Tabs */}
        <div className="flex space-x-2 border-b border-stone-200">
          {tabs.map((tab, index) => (
            <button
              key={index}
              onClick={() => setActiveTab(index)}
              className={`px-5 py-3 font-semibold text-sm transition-all duration-200 rounded-t-xl
                ${
                  activeTab === index
                    ? "text-[#7f5539] border-b-2 border-[#7f5539] bg-white shadow-sm"
                    : "text-stone-500 hover:text-[#7f5539] hover:bg-white/50"
                }`}
            >
              {tab.name}
            </button>
          ))}
        </div>

        {/* Tab Content Panel */}
        <div className="bg-white border border-stone-200 mt-6 p-6 shadow-xl rounded-2xl transition-all">
          {tabs[activeTab].component}
        </div>
      </div>

      {/* ChatModal Ditempatkan Di Luar Pembungkus Tab/Table */}
      <ChatModal
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        recipientId={chatRecipient.id}
        recipientName={chatRecipient.name || "Tenant"}
      />
    </div>
  );
};

export default OwnerHome;