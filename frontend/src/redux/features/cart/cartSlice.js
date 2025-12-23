import { createSlice } from "@reduxjs/toolkit";
import { calculateCartTotals, persistCart } from "../../../utils/cartUtils";

const cartFromStorage = (() => {
  try {
    const raw = localStorage.getItem("cart");
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
})();

const initialState = {
  cartItems: cartFromStorage.cartItems || [],
  shippingAddress: cartFromStorage.shippingAddress || {},
  paymentMethod: cartFromStorage.paymentMethod || "Razorpay",
  itemsPrice: cartFromStorage.itemsPrice || 0,
  shippingPrice: cartFromStorage.shippingPrice || 0,
  taxPrice: cartFromStorage.taxPrice || 0,
  totalPrice: cartFromStorage.totalPrice || 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { ...item } = action.payload;
      const idx = state.cartItems.findIndex((x) => x._id === item._id);
      if (idx >= 0) {
        state.cartItems[idx] = item;
      } else {
        state.cartItems.push(item);
      }

      const totals = calculateCartTotals(state.cartItems);
      state.itemsPrice = totals.itemsPrice;
      state.shippingPrice = totals.shippingPrice;
      state.taxPrice = totals.taxPrice;
      state.totalPrice = totals.totalPrice;

      persistCart(state);
    },

    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter((x) => x._id !== action.payload);

      const totals = calculateCartTotals(state.cartItems);
      state.itemsPrice = totals.itemsPrice;
      state.shippingPrice = totals.shippingPrice;
      state.taxPrice = totals.taxPrice;
      state.totalPrice = totals.totalPrice;

      persistCart(state);
    },

    saveShippingAddress: (state, action) => {
      state.shippingAddress = action.payload;
      persistCart(state);
    },

    savePaymentMethod: (state, action) => {
      state.paymentMethod = action.payload;
      persistCart(state);
    },

    clearCartItems: (state) => {
      state.cartItems = [];
      state.itemsPrice = 0;
      state.shippingPrice = 0;
      state.taxPrice = 0;
      state.totalPrice = 0;
      persistCart(state);
    },

    resetCart: () => {
      persistCart(initialState);
      return { ...initialState };
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  savePaymentMethod,
  saveShippingAddress,
  clearCartItems,
  resetCart,
} = cartSlice.actions;

export default cartSlice.reducer;
