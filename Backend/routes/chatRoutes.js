const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const {
  sendMessageController,
  getMessagesController,
  getOwnerChatsController,
  getRenterChatsController,
} = require("../controllers/chatController");

// Route Kirim & Ambil Pesan
router.post("/send", authMiddleware, sendMessageController);
router.get("/get/:receiverId", authMiddleware, getMessagesController);

// Route Daftar Chat Khusus Owner & Renter
router.get("/owner-chats", authMiddleware, getOwnerChatsController);
router.get("/renter-chats", authMiddleware, getRenterChatsController);

module.exports = router;