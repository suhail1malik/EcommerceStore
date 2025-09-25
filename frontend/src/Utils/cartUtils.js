const TAX_RATE = 0.15;
const SHIPPING_THRESHOLD = 100;
const SHIPPING_FLAT = 10;

export const addDecimals = (num) => {
  return Number((Math.round(num * 100) / 100).toFixed(2));
};

export const calculateCartTotals = (cartItems = []) => {
  const itemsPrice = addDecimals(
    (cartItems || []).reduce(
      (acc, item) => acc + (item.price || 0) * (item.qty || 0),
      0
    )
  );

  const shippingPrice = itemsPrice > SHIPPING_THRESHOLD ? 0 : SHIPPING_FLAT;
  const taxPrice = addDecimals(TAX_RATE * itemsPrice);
  const totalPrice = addDecimals(itemsPrice + shippingPrice + taxPrice);

  return { itemsPrice, shippingPrice, taxPrice, totalPrice };
};

// Pure persister: no returns, no dispatches
export const persistCart = (state) => {
  try {
    const cartForStorage = {
      cartItems: state.cartItems || [],
      itemsPrice: state.itemsPrice || 0,
      shippingPrice: state.shippingPrice || 0,
      taxPrice: state.taxPrice || 0,
      totalPrice: state.totalPrice || 0,
      shippingAddress: state.shippingAddress || {},
      paymentMethod: state.paymentMethod || "Razorpay",
    };
    localStorage.setItem("cart", JSON.stringify(cartForStorage));
  } catch (err) {
    // fail silently but log in dev
    if (import.meta.env.NODE_ENV !== "production")
      console.error("persistCart error", err);
  }
};
