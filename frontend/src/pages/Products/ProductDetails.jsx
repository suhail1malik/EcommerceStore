import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  useGetProductDetailsQuery,
  useCreateReviewMutation,
} from "../../redux/api/productApiSlice";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import {
  FaBox,
  FaClock,
  FaShoppingCart,
  FaStar,
  FaStore,
} from "react-icons/fa";
import moment from "moment";
import HeartIcon from "../Products/HeartIcon";
import Ratings from "../Products/Ratings";
import ProductTabs from "../Products/ProductTabs";
import SmallProduct from "../Products/SmallProduct";
import { addToCart } from "../../redux/features/cart/cartSlice";
const BASE_URL = import.meta.env.VITE_BACKEND_URL || "";

/**
 * ProductDetails (responsive)
 * - Uses a centered max-width container
 * - Image left / details right on lg, stacked on mobile
 * - Uses getImageSource fallback helper
 */

const ProductDetails = () => {
  const { id: productId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const {
    data: product,
    isLoading,
    refetch,
    error,
  } = useGetProductDetailsQuery(productId || "");

  const { userInfo } = useSelector((state) => state.auth || {});

  const [createReview, { isLoading: loadingProductReview }] =
    useCreateReviewMutation();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await createReview({ productId, rating, comment }).unwrap();
      refetch();
      toast.success("Review created successfully");
      setRating(0);
      setComment("");
    } catch (err) {
      toast.error(err?.data?.message || err.message || "Review failed");
    }
  };

  const addToCartHandler = () => {
    dispatch(addToCart({ ...product, qty: Number(qty) }));
    navigate("/cart");
  };

  const getImageSource = (img) => {
    if (!img)
      return "https://via.placeholder.com/640x480/374151/9ca3af?text=No+Image";
    if (img.startsWith("http")) return img;
    if (img.startsWith("/uploads")) return `${BASE_URL}${img}`;
    return `${BASE_URL}/uploads/${img}`;
  };

  if (isLoading) return <Loader />;
  if (error)
    return (
      <Message variant="danger">
        {error?.data?.message || error?.message || "Failed to load product"}
      </Message>
    );

  if (!product) return null;

  // safe timestamp: handle createAt OR createdAt
  const createdAt = product.createdAt || product.createAt || null;

  // related fallback (if your API provides related or sameBrand, plug it here)
  const related = product.related || [];

  return (
    <div className="w-full px-4 sm:px-6 lg:px-12 py-8">
      <div className="max-w-[1200px] mx-auto">
        <Link to="/" className="text-slate-200 hover:underline">
          ← Back to home
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start mt-6">
          {/* Image */}
          <div>
            <div className="rounded-lg overflow-hidden bg-slate-800">
              <img
                src={getImageSource(product.image)}
                alt={product.name}
                className="w-full h-auto object-cover"
                loading="lazy"
              />
            </div>

            <div className="mt-3">
              <HeartIcon product={product} />
            </div>
          </div>

          {/* Details (span 2 on desktop) */}
          <div className="lg:col-span-2">
            <h1 className="text-2xl sm:text-3xl font-semibold text-slate-100">
              {product.name}
            </h1>

            <p className="text-sm text-slate-400 mt-2">{product.description}</p>

            <div className="mt-4">
              <span className="text-2xl sm:text-3xl font-extrabold text-pink-500">
                ₹{product.price?.toLocaleString("en-IN")}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 text-sm text-slate-300">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <FaStore /> <span className="text-slate-200">Brand:</span>{" "}
                  {product.brand}
                </div>
                <div className="flex items-center gap-2">
                  <FaClock /> <span className="text-slate-200">Added:</span>{" "}
                  {createdAt ? moment(createdAt).fromNow() : "-"}
                </div>
                <div className="flex items-center gap-2">
                  <FaStar /> <span className="text-slate-200">Reviews:</span>{" "}
                  {product.numReviews || 0}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <FaStar /> <span className="text-slate-200">Rating:</span>{" "}
                  {product.rating || 0}
                </div>
                <div className="flex items-center gap-2">
                  <FaShoppingCart />{" "}
                  <span className="text-slate-200">Quantity:</span>{" "}
                  {product.quantity ?? "-"}
                </div>
                <div className="flex items-center gap-2">
                  <FaBox /> <span className="text-slate-200">In stock:</span>{" "}
                  {product.countInStock ?? 0}
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-4">
                <Ratings
                  value={product.rating}
                  text={`${product.numReviews || 0} reviews`}
                />
                {product.countInStock > 0 && (
                  <div>
                    <label htmlFor="qty" className="sr-only">
                      Quantity
                    </label>
                    <select
                      id="qty"
                      value={qty}
                      onChange={(e) => setQty(Number(e.target.value))}
                      className="bg-slate-800 text-slate-200 border border-slate-700 rounded px-3 py-2"
                    >
                      {[...Array(Math.max(1, product.countInStock)).keys()].map(
                        (x) => (
                          <option key={x + 1} value={x + 1}>
                            {x + 1}
                          </option>
                        )
                      )}
                    </select>
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={addToCartHandler}
                  disabled={product.countInStock === 0}
                  className="bg-pink-600 disabled:opacity-50 text-white px-4 py-2 rounded-md"
                >
                  Add to cart
                </button>

                <Link
                  to="/shop"
                  className="inline-flex items-center px-4 py-2 border border-slate-700 rounded-md text-slate-200"
                >
                  Continue shopping
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-8">
          <ProductTabs
            loadingProductReview={loadingProductReview}
            userInfo={userInfo}
            submitHandler={submitHandler}
            rating={rating}
            setRating={setRating}
            comment={comment}
            setComment={setComment}
            product={product}
          />
        </div>

        {/* Related */}
        {related && related.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-slate-100 mb-4">
              Related products
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-stretch">
              {related.slice(0, 8).map((r) => (
                <SmallProduct key={r._id || r.id} product={r} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
