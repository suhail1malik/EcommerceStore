import { apiSlice } from "./apiSlice";
import { RAZORPAY_URL } from "../constants";

export const razorpayApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get Razorpay configuration
    getRazorpayConfig: builder.query({
      query: () => ({
        url: `${RAZORPAY_URL}/config`,
        method: "GET",
      }),
    }),

    // Create Razorpay order
    createRazorpayOrder: builder.mutation({
      query: (orderData) => ({
        url: `${RAZORPAY_URL}/create-order`,
        method: "POST",
        body: orderData,
      }),
    }),

    // Verify Razorpay payment
    verifyRazorpayPayment: builder.mutation({
      query: (paymentData) => ({
        url: `${RAZORPAY_URL}/verify-payment`,
        method: "POST",
        body: paymentData,
      }),
    }),
  }),
});

export const {
  useGetRazorpayConfigQuery,
  useCreateRazorpayOrderMutation,
  useVerifyRazorpayPaymentMutation,
} = razorpayApiSlice;
