import React, { useState, useEffect } from "react";
import axios from "axios";

axios.defaults.withCredentials = true;

const OwnerMessages = ({ onOpenChat }) => {
  const [chatList, setChatList] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOwnerChats = async () => {
    try {
      const res = await axios.get("http://localhost:8001/api/chat/owner-chats", {
        withCredentials: true,
      });
      if (res.data.success) {
        setChatList(res.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching chats:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOwnerChats();
    const interval = setInterval(fetchOwnerChats, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm">
      <div className="flex justify-between items-center mb-6 border-b border-stone-100 pb-4">
        <div>
          <h2 className="text-xl font-bold text-[#7f5539]">Inquiries & Messages</h2>
          <p className="text-xs text-stone-500 mt-1">
            Daftar pertanyaan dari calon penyewa (termasuk yang belum booking)
          </p>
        </div>
        <button
          onClick={fetchOwnerChats}
          className="text-xs bg-[#faedcd] text-[#7f5539] px-3.5 py-1.5 rounded-xl font-semibold hover:bg-[#7f5539] hover:text-white transition shadow-sm"
        >
          🔄 Refresh
        </button>
      </div>

      {loading ? (
        <div className="text-center py-10 text-stone-400 text-sm">Memuat daftar pesan...</div>
      ) : chatList.length > 0 ? (
        <div className="space-y-3">
          {chatList.map((chat) => (
            <div
              key={chat.renterId}
              className="p-4 border border-stone-200 rounded-xl bg-[#faf8f5] flex justify-between items-center hover:border-[#7f5539] transition shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#7f5539]/10 text-[#7f5539] flex items-center justify-center font-bold text-sm">
                  {chat.renterName?.charAt(0).toUpperCase() || "R"}
                </div>
                <div>
                  <h4 className="font-bold text-stone-800 text-sm">{chat.renterName}</h4>
                  <p className="text-xs text-stone-500 line-clamp-1 mt-0.5">{chat.lastMessage}</p>
                </div>
              </div>

              <button
                onClick={() => onOpenChat && onOpenChat(chat.renterId, chat.renterName)}
                className="bg-[#7f5539] text-white px-4 py-2 rounded-xl text-xs font-semibold hover:bg-[#65432d] transition flex items-center gap-1.5 shadow-sm active:scale-95"
              >
                💬 Balas Chat
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-stone-400 text-sm italic">
          Belum ada pertanyaan masuk dari calon penyewa.
        </div>
      )}
    </div>
  );
};

export default OwnerMessages;