import Razorpay from "razorpay";
import asyncHandler from "../middlewares/asyncHandler.js";
import dotenv from "dotenv";

dotenv.config();
// Create Razorpay instance dynamically
const createRazorpayInstance = () => {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    throw new Error("Razorpay keys not configured");
  }

  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
};
// Removed console.log statements for security

// Validate Razorpay configuration
if (!process.env.RAZORPAY_KEY_SECRET) {
  console.warn(
    "⚠️  WARNING: Razorpay secret key not configured. Payment functionality will not work."
  );
  console.warn("   Please add RAZORPAY_KEY_SECRET to your .env file");
} else {
  console.log("✅ Razorpay keys configured successfully");
}

// Create Razorpay order
const createRazorpayOrder = asyncHandler(async (req, res) => {
  const { amount, currency = "INR", receipt } = req.body;

  if (!amount) {
    return res.status(400).json({ message: "Amount is required" });
  }

  // Check if Razorpay keys are properly configured
  if (!process.env.RAZORPAY_KEY_SECRET) {
    return res.status(500).json({
      success: false,
      message:
        "Razorpay secret key not configured. Please add RAZORPAY_KEY_SECRET to your .env file",
    });
  }

  try {
    const razorpay = createRazorpayInstance();

    const options = {
      amount: Math.round(amount * 100), // Convert to paise (smallest currency unit)
      currency: currency,
      receipt: receipt || `rcpt_${Date.now().toString().slice(-8)}`, // Shorter receipt ID
      payment_capture: 1,
    };

    const order = await razorpay.orders.create(options);

    res.json({
      success: true,
      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
        receipt: order.receipt,
      },
    });
  } catch (error) {
    console.error("Razorpay order creation error:", error);

    // Provide more specific error messages
    if (error.statusCode === 401) {
      res.status(500).json({
        success: false,
        message: "Razorpay authentication failed. Please check your API keys.",
        error: "Invalid API credentials",
      });
    } else {
      res.status(500).json({
        success: false,
        message: "Failed to create payment order",
        error: error.message,
      });
    }
  }
});

// Verify Razorpay payment
const verifyRazorpayPayment = asyncHandler(async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return res
      .status(400)
      .json({ message: "Payment verification data is incomplete" });
  }

  try {
    // Verify the payment signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const crypto = await import("crypto");

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      res.json({
        success: true,
        message: "Payment verified successfully",
        payment_id: razorpay_payment_id,
        order_id: razorpay_order_id,
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Payment verification failed - Invalid signature",
      });
    }
  } catch (error) {
    console.error("Payment verification error:", error);
    res.status(500).json({
      success: false,
      message: "Payment verification failed",
      error: error.message,
    });
  }
});

// Get Razorpay configuration
const getRazorpayConfig = asyncHandler(async (req, res) => {
  res.json({
    key_id: process.env.RAZORPAY_KEY_ID,
    currency: "INR",
  });
});

export { createRazorpayOrder, verifyRazorpayPayment, getRazorpayConfig };
