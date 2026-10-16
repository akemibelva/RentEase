const Chat = require("../models/ChatSchema");
require("../models/UserSchema"); // Memastikan model "user" sudah diregister ke Mongoose

// 1. Mengirim pesan baru
const sendMessageController = async (req, res) => {
  try {
    const { receiverId, propertyId, message } = req.body;
    const senderId = req.body.userId;

    if (!receiverId || !message) {
      return res.status(400).json({ success: false, message: "Receiver ID and message are required" });
    }

    const newChat = new Chat({
      senderId,
      receiverId,
      propertyId,
      message,
    });

    await newChat.save();

    return res.status(201).json({
      success: true,
      message: "Message sent successfully",
      data: newChat,
    });
  } catch (error) {
    console.error("Error sending message:", error);
    return res.status(500).json({ success: false, message: "Failed to send message" });
  }
};

// 2. Mengambil riwayat pesan antara 2 user
const getMessagesController = async (req, res) => {
  try {
    const { receiverId } = req.params;
    const senderId = req.body.userId;

    const messages = await Chat.find({
      $or: [
        { senderId, receiverId },
        { senderId: receiverId, receiverId: senderId },
      ],
    }).sort({ createdAt: 1 });

    return res.status(200).json({
      success: true,
      data: messages,
    });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch messages" });
  }
};

// 3. Mengambil daftar percakapan masuk untuk Owner
const getOwnerChatsController = async (req, res) => {
  try {
    const ownerId = req.body.userId || req.user?.id || req.query.userId;

    if (!ownerId) {
      return res.status(400).json({ success: false, message: "User ID missing" });
    }

    // Cari semua pesan yang melibatkan Owner
    const chats = await Chat.find({
      $or: [{ receiverId: ownerId }, { senderId: ownerId }],
    })
      .populate("senderId", "name email")
      .populate("receiverId", "name email")
      .sort({ createdAt: -1 });

    const conversationsMap = new Map();

    chats.forEach((chat) => {
      if (!chat || !chat.senderId || !chat.receiverId) return;

      const senderObj = chat.senderId;
      const senderIdStr = senderObj._id ? senderObj._id.toString() : senderObj.toString();
      const isSenderOwner = senderIdStr === ownerId.toString();

      const renter = isSenderOwner ? chat.receiverId : chat.senderId;

      if (renter && (renter._id || typeof renter === "string")) {
        const renterIdStr = renter._id ? renter._id.toString() : renter.toString();

        if (!conversationsMap.has(renterIdStr)) {
          conversationsMap.set(renterIdStr, {
            renterId: renterIdStr,
            renterName: renter.name || renter.email || "Calon Penyewa",
            lastMessage: chat.message,
            updatedAt: chat.createdAt,
          });
        }
      }
    });

    return res.status(200).json({
      success: true,
      data: Array.from(conversationsMap.values()),
    });
  } catch (error) {
    console.error("Error fetching owner chats:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch chats", error: error.message });
  }
};

// Mengambil daftar percakapan untuk Renter
const getRenterChatsController = async (req, res) => {
  try {
    const renterId = req.body.userId || req.user?.id || req.query.userId;

    if (!renterId) {
      return res.status(400).json({ success: false, message: "User ID missing" });
    }

    const chats = await Chat.find({
      $or: [{ receiverId: renterId }, { senderId: renterId }],
    })
      .populate("senderId", "name email")
      .populate("receiverId", "name email")
      .sort({ createdAt: -1 });

    const conversationsMap = new Map();

    chats.forEach((chat) => {
      if (!chat || !chat.senderId || !chat.receiverId) return;

      const senderObj = chat.senderId;
      const senderIdStr = senderObj._id ? senderObj._id.toString() : senderObj.toString();
      const isSenderRenter = senderIdStr === renterId.toString();

      // Lawan bicara Renter adalah Owner
      const owner = isSenderRenter ? chat.receiverId : chat.senderId;

      if (owner && (owner._id || typeof owner === "string")) {
        const ownerIdStr = owner._id ? owner._id.toString() : owner.toString();

        if (!conversationsMap.has(ownerIdStr)) {
          conversationsMap.set(ownerIdStr, {
            ownerId: ownerIdStr,
            ownerName: owner.name || owner.email || "Property Owner",
            lastMessage: chat.message,
            updatedAt: chat.createdAt,
          });
        }
      }
    });

    return res.status(200).json({
      success: true,
      data: Array.from(conversationsMap.values()),
    });
  } catch (error) {
    console.error("Error fetching renter chats:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch chats" });
  }
};

// Jangan lupa daftarkan di module.exports:
module.exports = {
  sendMessageController,
  getMessagesController,
  getOwnerChatsController,
  getRenterChatsController,
};

