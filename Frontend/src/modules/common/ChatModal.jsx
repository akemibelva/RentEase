import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { message as antMessage } from "antd";

axios.defaults.withCredentials = true;

const ChatModal = ({ isOpen, onClose, recipientId, recipientName }) => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const chatBottomRef = useRef(null);

  // Auto-scroll ke pesan terbawah
  const scrollToBottom = () => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Ambil riwayat pesan saat modal dibuka
  const fetchMessages = async () => {
    if (!recipientId) return;
    try {
      const res = await axios.get(
        `http://localhost:8001/api/chat/get/${recipientId}`,
        { withCredentials: true }
      );
      if (res.data.success) {
        setMessages(res.data.data);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && recipientId) {
      setLoading(true);
      fetchMessages();
      const interval = setInterval(fetchMessages, 3000);
      return () => clearInterval(interval);
    }
  }, [isOpen, recipientId]);

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  // Kirim pesan baru ke backend
  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const messageText = inputText;
    setInputText("");

    try {
      const res = await axios.post(
        "http://localhost:8001/api/chat/send",
        {
          receiverId: recipientId,
          message: messageText,
        },
        { withCredentials: true }
      );

      if (res.data.success) {
        setMessages((prev) => [...prev, res.data.data]);
        scrollToBottom();
      } else {
        antMessage.error("Gagal mengirim pesan");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      antMessage.error("Gagal terhubung ke server chat");
    }
  };

  if (!isOpen) return null;

  return (
    /* Menggunakan fixed bottom-6 right-6 z-[9999] agar terlepas dari skrol parent */
    <div className="fixed bottom-6 right-6 z-[9999] w-80 sm:w-96 bg-white border border-stone-200 rounded-2xl shadow-2xl overflow-hidden font-sans flex flex-col h-[450px]">
      {/* Header */}
      <div className="bg-[#7f5539] text-white p-4 flex justify-between items-center shadow-sm">
        <div>
          <h4 className="font-bold text-sm line-clamp-1">{recipientName || "Property Owner"}</h4>
          <span className="text-[11px] text-[#faedcd] flex items-center gap-1.5 mt-0.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse"></span> Active Chat
          </span>
        </div>
        <button
          onClick={onClose}
          className="text-white/80 hover:text-white text-sm font-bold w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition"
        >
          ✕
        </button>
      </div>

      {/* Messages List */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#faf8f5] text-xs">
        {loading && messages.length === 0 ? (
          <p className="text-center text-stone-400 py-4">Memuat percakapan...</p>
        ) : messages.length > 0 ? (
          messages.map((msg, idx) => {
            const isMe = msg.senderId !== recipientId;
            return (
              <div
                key={msg._id || idx}
                className={`flex ${isMe ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-2xl leading-relaxed ${
                    isMe
                      ? "bg-[#7f5539] text-white rounded-br-none shadow-sm"
                      : "bg-white text-stone-800 border border-stone-200 rounded-bl-none shadow-sm"
                  }`}
                >
                  {msg.message}
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-center text-stone-400 py-6 italic">
            Belum ada pesan. Mulai obrolan sekarang!
          </p>
        )}
        <div ref={chatBottomRef} />
      </div>

      {/* Input Field */}
      <form onSubmit={handleSend} className="p-3 border-t border-stone-200 bg-white flex gap-2">
        <input
          type="text"
          placeholder="Tulis pesan..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="flex-1 bg-[#faf8f5] border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#7f5539]/30 focus:border-[#7f5539]"
        />
        <button
          type="submit"
          className="bg-[#7f5539] text-white px-4 py-2 rounded-xl font-semibold text-xs hover:bg-[#65432d] transition shadow-md shadow-[#7f5539]/20 active:scale-95"
        >
          Kirim
        </button>
      </form>
    </div>
  );
};

export default ChatModal;