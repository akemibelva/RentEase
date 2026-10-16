const express = require("express");

// Import authMiddleware TANPA kurung kurawal {}
const authMiddleware = require("../middlewares/authMiddleware");

const {
  registerController,
  loginController,
  forgotPasswordController,
  getAllPropertiesController,
  authController,
  bookingHandleController,
  getAllBookingsController,
  getPropertyByIdController, // Ditambahkan untuk halaman Property Detail
} = require("../controllers/userController");

const router = express.Router();

// Public Routes
router.post("/register", registerController);
router.post("/login", loginController);
router.post("/forgotpassword", forgotPasswordController);
router.get("/getAllProperties", getAllPropertiesController);
router.get("/getProperty/:id", getPropertyByIdController); // Rute detail properti

// Protected Routes (Membutuhkan token via authMiddleware)
router.post("/getuserdata", authMiddleware, authController);
router.post("/bookinghandle/:propertyid", authMiddleware, bookingHandleController);
router.get("/getallbookings", authMiddleware, getAllBookingsController);

module.exports = router;