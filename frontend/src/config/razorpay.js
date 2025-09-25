// Razorpay Configuration
export const RAZORPAY_CONFIG = {
  // Test keys (replace with your actual keys in production)
  key_id: "rzp_test_your_test_key_id_here",
  currency: "INR",

  // Styling
  theme: {
    color: "#F37254",
  },

  // Company details
  company: {
    name: "Your Store Name",
    description: "E-commerce Store",
  },

  // Payment options
  paymentOptions: {
    upi: true,
    cards: true,
    netbanking: true,
    wallets: true,
  },
};

// Environment-based configuration
export const getRazorpayConfig = () => {
  if (import.meta.env.VITE_RAZORPAY_KEY_ID) {
    return {
      ...RAZORPAY_CONFIG,
      key_id: import.meta.env.VITE_RAZORPAY_KEY_ID,
    };
  }
  // Use backend key if available
  return RAZORPAY_CONFIG;
};
