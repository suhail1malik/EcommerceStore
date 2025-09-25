import express from "express";
import {
  createRazorpayOrder,
  verifyRazorpayPayment,
  getRazorpayConfig,
} from "../controllers/razorpayController.js";

const router = express.Router();

// Get Razorpay configuration
router.get("/config", getRazorpayConfig);

// Create Razorpay order
router.post("/create-order", createRazorpayOrder);

// Verify payment
router.post("/verify-payment", verifyRazorpayPayment);

export default router;



