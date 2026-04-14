import React, { useEffect, useState } from "react";
import {
  useGetRazorpayConfigQuery,
  useCreateRazorpayOrderMutation,
} from "../redux/api/razorpayApiSlice";
import { toast } from "react-toastify";

const RazorpayPayment = ({
  amount,
  orderId,
  onSuccess,
  onFailure,
  disabled = false,
}) => {
  const [loading, setLoading] = useState(false);
  const { data: razorpayConfig, isLoading: configLoading } =
    useGetRazorpayConfigQuery();
  const [createRazorpayOrder] = useCreateRazorpayOrderMutation();

  useEffect(() => {
    // Load Razorpay script
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const handlePayment = async () => {
    // Check if config is loading
    if (configLoading) {
      toast.info("Loading payment gateway...");
      return;
    }

    // Use backend config instead of frontend config
    if (!razorpayConfig?.key_id) {
      toast.error(
        "Payment gateway not configured. Please add your Razorpay keys."
      );
      return;
    }

    setLoading(true);

    try {
      // First, create a Razorpay order
      const receiptString = orderId && orderId !== "new_order" 
        ? `ord_${orderId.slice(-6)}_${Date.now().toString().slice(-6)}` 
        : `receipt_${Date.now().toString().slice(-8)}`;

      const razorpayOrderResponse = await createRazorpayOrder({
        amount: amount,
        currency: "INR",
        receipt: receiptString,
      }).unwrap();

      if (!razorpayOrderResponse.success) {
        console.error("Razorpay order creation failed:", razorpayOrderResponse);
        const errorMessage =
          razorpayOrderResponse.message || "Failed to create payment order";
        toast.error(errorMessage);
        throw new Error(errorMessage);
      }

      const razorpayOrder = razorpayOrderResponse.order;

      // Now create the payment options
      const options = {
        key: razorpayConfig.key_id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: razorpayConfig.company?.name || "Your Store",
        description: `Order #${orderId}`,
        order_id: razorpayOrder.id, // Use Razorpay order ID
        handler: function (response) {
          // Payment successful
          toast.success("Payment successful!");
          onSuccess({
            ...response,
            ...(orderId && orderId !== "new_order" && { dbOrderId: orderId }),
          });
        },
        // Enable all payment methods
        prefill: {
          name: "Customer Name",
          email: "customer@example.com",
          contact: "9999999999",
        },
        notes: {
          address: "Customer Address",
          ...(orderId && orderId !== "new_order" && { db_order_id: orderId }),
        },
        theme: {
          color: razorpayConfig.theme?.color || "#d97706",
        },
        // Enable all payment options
        config: {
          display: {
            blocks: {
              banks: {
                name: "Pay using UPI",
                instruments: [
                  {
                    method: "upi",
                  },
                ],
              },
              cards: {
                name: "Pay using Cards",
                instruments: [
                  {
                    method: "card",
                  },
                ],
              },
              netbanking: {
                name: "Pay using Net Banking",
                instruments: [
                  {
                    method: "netbanking",
                  },
                ],
              },
            },
          },
        },
        modal: {
          ondismiss: function () {
            // Payment modal closed
            setLoading(false);
            onFailure("Payment cancelled by user");
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Payment failed. Please try again.");
      onFailure(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (configLoading) {
    return (
      <button
        disabled
        className="bg-gray-400 text-white py-3 px-6 rounded-lg text-lg font-semibold w-full"
      >
        Loading...
      </button>
    );
  }

  return (
    <button
      onClick={handlePayment}
      disabled={disabled || loading}
      className={`py-3 px-6 rounded-lg text-lg font-semibold w-full transition-colors ${
        disabled || loading
          ? "bg-gray-400 text-gray-200 cursor-not-allowed"
          : "bg-emerald-600 dark:bg-emerald-500 text-white hover:bg-emerald-700 focus:ring-4 focus:ring-emerald-500/20"
      }`}
    >
      {loading ? "Processing..." : `Pay ₹${amount?.toLocaleString("en-IN")}`}
    </button>
  );
};

export default RazorpayPayment;
