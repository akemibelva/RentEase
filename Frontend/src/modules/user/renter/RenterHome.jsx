import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../../../App";
import PropTypes from "prop-types";
import AllPropertiesCards from "../AllPropertiesCards";
import AllProperty from "./AllProperties";
import RenterMessages from "./RenterMessages";
import ChatModal from "../../common/ChatModal";

const CustomTabPanel = ({ children, value, index }) => {
  return (
    <div role="tabpanel" hidden={value !== index} className="w-full mt-6">
      {value === index && <div>{children}</div>}
    </div>
  );
};

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

const RenterHome = () => {
  const user = useContext(UserContext);
  const [value, setValue] = useState(0);

  // State Modal Chat Global
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatRecipient, setChatRecipient] = useState({ id: null, name: "" });

  if (!user || !user.userData) return null;

  const handleLogOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  const openChat = (recipientId, recipientName) => {
    setChatRecipient({ id: recipientId, name: recipientName });
    setIsChatOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] font-sans relative">
      {/* Navbar */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-[#7f5539]/10 shadow-sm px-8 py-4 flex items-center justify-between">
        <Link to="/" className="text-2xl font-extrabold text-[#7f5539] tracking-tight flex items-center gap-2">
          <span className="bg-[#7f5539] text-white w-9 h-9 rounded-xl flex items-center justify-center font-bold text-lg shadow-md shadow-[#7f5539]/20">R</span>
          <span>Rent<span className="text-[#7f5539]">Ease</span></span>
        </Link>
        <div className="flex items-center gap-6">
          <h5 className="font-medium text-stone-700 text-sm">
            Hi, <span className="font-bold text-[#7f5539]">{user.userData.name}</span>
          </h5>
          <Link
            to="/"
            onClick={handleLogOut}
            className="px-4 py-2 text-sm bg-rose-600 text-white font-medium rounded-xl hover:bg-rose-700 transition shadow-sm"
          >
            Log Out
          </Link>
        </div>
      </nav>

      {/* Main Tabs Container */}
      <div className="w-full max-w-6xl mx-auto mt-8 bg-white border border-stone-200 shadow-xl rounded-2xl p-6">
        <div className="flex border-b border-stone-200">
          <button
            className={`px-6 py-3 text-sm font-semibold transition-all ${
              value === 0
                ? "text-[#7f5539] border-b-2 border-[#7f5539]"
                : "text-stone-500 hover:text-[#7f5539]"
            }`}
            onClick={() => setValue(0)}
          >
            All Properties
          </button>
          <button
            className={`px-6 py-3 text-sm font-semibold transition-all ${
              value === 1
                ? "text-[#7f5539] border-b-2 border-[#7f5539]"
                : "text-stone-500 hover:text-[#7f5539]"
            }`}
            onClick={() => setValue(1)}
          >
            Booking History
          </button>
          <button
            className={`px-6 py-3 text-sm font-semibold transition-all ${
              value === 2
                ? "text-[#7f5539] border-b-2 border-[#7f5539]"
                : "text-stone-500 hover:text-[#7f5539]"
            }`}
            onClick={() => setValue(2)}
          >
            Messages
          </button>
        </div>

        {/* Tab Panels */}
        <CustomTabPanel value={value} index={0}>
          <div className="mt-2">
            <AllPropertiesCards loggedIn={user.userLoggedIn} />
          </div>
        </CustomTabPanel>

        <CustomTabPanel value={value} index={1}>
          <div className="mt-2">
            <AllProperty />
          </div>
        </CustomTabPanel>

        <CustomTabPanel value={value} index={2}>
          <div className="mt-2">
            <RenterMessages onOpenChat={openChat} />
          </div>
        </CustomTabPanel>
      </div>

      {/* ChatModal Melayang Bebas */}
      <ChatModal
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        recipientId={chatRecipient.id}
        recipientName={chatRecipient.name || "Property Owner"}
      />
    </div>
  );
};

export default RenterHome;