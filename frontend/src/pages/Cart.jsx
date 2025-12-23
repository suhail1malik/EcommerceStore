import React, { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaTrash } from "react-icons/fa";
import { addToCart, removeFromCart } from "../redux/features/cart/cartSlice";
import getImageSource from "../utils/images";

// Cart component start from here
const Cart = () => {
  const navigate = useNavigate(); // use navigate is used for navigate progamatically
  const dispatch = useDispatch(); // dispatch is used to dispatch an action to mutate state in redux

  const { cartItems } = useSelector((state) => state.cart);

  const addToCartHandler = (product, qty) => {
    dispatch(addToCart({ ...product, qty }));
  };

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
  };

  const { itemsPrice, shippingPrice, taxPrice, totalPrice } = useMemo(() => {
    const itemsPrice = cartItems.reduce(
      (acc, item) => acc + (item.price || 0) * (item.qty || 0),
      0
    );
    const shippingPrice = itemsPrice > 100 ? 0 : 10;
    const taxPrice = 0.15 * itemsPrice;
    const totalPrice = itemsPrice + shippingPrice + taxPrice;
    return { itemsPrice, shippingPrice, taxPrice, totalPrice };
  }, [cartItems]);

  return (
    <div className="w-full px-4 sm:px-6 lg:px-12 py-8">
      {cartItems.length === 0 ? (
        <div className="max-w-3xl mx-auto text-center py-20">
          <h2 className="text-xl font-semibold mb-3">Your cart is empty</h2>
          <p className="text-slate-400 mb-6">
            Looks like you haven't added anything yet.
          </p>
          <Link
            to="/shop"
            className="inline-block px-5 py-2 rounded-md bg-pink-600 text-white"
          >
            Go To Shop
          </Link>
        </div>
      ) : (
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT COLUMN */}
          <div className="lg:col-span-2">
            <h1 className="text-2xl font-semibold mb-6">Shopping Cart</h1>

            <div className="space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item._id}
                  className="flex flex-col sm:flex-row items-center sm:items-start gap-4 p-4 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800"
                >
                  {/* IMAGE */}
                  <div className="flex-shrink-0">
                    <img
                      src={getImageSource(item.image)}
                      alt={item.name}
                      className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-md"
                    />
                  </div>

                  {/* PRODUCT INFO */}
                  <div className="flex-1 min-w-0 text-center sm:text-left">
                    <Link
                      to={`/product/${item._id}`}
                      className="text-lg font-medium text-slate-900 dark:text-slate-100 hover:text-pink-600 dark:hover:text-pink-400 transition-colors"
                    >
                      {item.name}
                    </Link>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                      {item.brand}
                    </p>
                    <p className="text-lg font-semibold text-pink-600 dark:text-pink-400 mt-2">
                      ₹{item.price}
                    </p>
                  </div>

                  {/* QUANTITY CONTROLS */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() =>
                        addToCartHandler(item, Math.max(0, item.qty - 1))
                      }
                      className="w-8 h-8 rounded-full border border-slate-300 dark:border-slate-600 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                    >
                      -
                    </button>
                    <span className="w-8 text-center font-medium">
                      {item.qty}
                    </span>
                    <button
                      onClick={() => addToCartHandler(item, item.qty + 1)}
                      className="w-8 h-8 rounded-full border border-slate-300 dark:border-slate-600 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                    >
                      +
                    </button>
                  </div>

                  {/* REMOVE BUTTON */}
                  <button
                    onClick={() => removeFromCartHandler(item._id)}
                    className="p-2 text-red-500 hover:text-red-700 dark:hover:text-red-400 transition-colors"
                  >
                    <FaTrash className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT COLUMN - ORDER SUMMARY */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-6 sticky top-6">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span>Items ({cartItems.length})</span>
                  <span>₹{itemsPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>
                    {shippingPrice === 0 ? (
                      <span className="text-green-600">Free</span>
                    ) : (
                      `₹${shippingPrice.toFixed(2)}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>₹{taxPrice.toFixed(2)}</span>
                </div>
                <hr className="border-slate-200 dark:border-slate-600" />
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>₹{totalPrice.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={() => navigate("/shipping")}
                className="w-full py-3 px-4 bg-pink-600 text-white font-medium rounded-md hover:bg-pink-700 transition-colors"
              >
                Proceed to Checkout
              </button>

              <Link
                to="/shop"
                className="block w-full text-center py-2 px-4 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors mt-3"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
