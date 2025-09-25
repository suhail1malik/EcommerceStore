// src/components/Products/ProductTabs.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import Ratings from "./Ratings";
import { useGetTopProductsQuery } from "../../redux/api/productApiSlice";
import SmallProduct from "./SmallProduct";
import Loader from "../../components/Loader";

/**
 * Responsive ProductTabs
 * - Left tab column: full-width on mobile, narrow column on md+
 * - Right content: fills remaining width
 * - Reviews & Related use responsive grid or horizontal scroll on large screens
 */

const ProductTabs = ({
  loadingProductReview,
  userInfo,
  submitHandler,
  rating,
  setRating,
  comment,
  setComment,
  product,
}) => {
  const { data, isLoading } = useGetTopProductsQuery();
  const [activeTab, setActiveTab] = useState(1);

  if (isLoading) return <Loader />;

  return (
    <div className="w-full max-w-[1200px] mx-auto">
      {/* Top-level layout: column on mobile, row on md */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* LEFT: Tabs menu - full width on mobile, fixed narrow column on md+ */}
        <nav className="w-full md:w-44 flex md:flex-col gap-2">
          <button
            type="button"
            onClick={() => setActiveTab(1)}
            aria-pressed={activeTab === 1}
            className={`text-left px-2 py-3 rounded ${
              activeTab === 1
                ? "font-semibold text-slate-100"
                : "text-slate-300"
            }`}
          >
            Write Your Review
          </button>

          <button
            type="button"
            onClick={() => setActiveTab(2)}
            aria-pressed={activeTab === 2}
            className={`text-left px-2 py-3 rounded ${
              activeTab === 2
                ? "font-semibold text-slate-100"
                : "text-slate-300"
            }`}
          >
            All Reviews
          </button>

          <button
            type="button"
            onClick={() => setActiveTab(3)}
            aria-pressed={activeTab === 3}
            className={`text-left px-2 py-3 rounded ${
              activeTab === 3
                ? "font-semibold text-slate-100"
                : "text-slate-300"
            }`}
          >
            Related Products
          </button>
        </nav>

        {/* RIGHT: Content area (fills remaining space) */}
        <div className="flex-1">
          {/* Tab 1: Write review */}
          {activeTab === 1 && (
            <div className="mt-1">
              {userInfo ? (
                <form onSubmit={submitHandler} className="space-y-4">
                  <div>
                    <label
                      htmlFor="rating"
                      className="block text-sm font-medium text-slate-200 mb-2"
                    >
                      Rating
                    </label>
                    <select
                      id="rating"
                      required
                      value={rating}
                      onChange={(e) => setRating(Number(e.target.value))}
                      className="w-full max-w-md p-2 rounded border bg-slate-800 text-slate-200"
                    >
                      <option value="">Select</option>
                      <option value={1}>1 - Inferior</option>
                      <option value={2}>2 - Decent</option>
                      <option value={3}>3 - Great</option>
                      <option value={4}>4 - Excellent</option>
                      <option value={5}>5 - Exceptional</option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="comment"
                      className="block text-sm font-medium text-slate-200 mb-2"
                    >
                      Comment
                    </label>
                    <textarea
                      id="comment"
                      rows="4"
                      required
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="w-full max-w-xl p-2 rounded border bg-slate-800 text-slate-200"
                    />
                  </div>

                  <div>
                    <button
                      type="submit"
                      disabled={loadingProductReview}
                      className="bg-pink-600 text-white px-4 py-2 rounded-md"
                    >
                      Submit
                    </button>
                  </div>
                </form>
              ) : (
                <p className="text-slate-300">
                  Please{" "}
                  <Link to="/login" className="text-pink-400 underline">
                    sign in
                  </Link>{" "}
                  to write a review
                </p>
              )}
            </div>
          )}

          {/* Tab 2: All reviews */}
          {activeTab === 2 && (
            <div className="mt-1 space-y-4">
              {!product.reviews || product.reviews.length === 0 ? (
                <p className="text-slate-400">No reviews yet.</p>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {product.reviews.map((review) => (
                    <article
                      key={review._id}
                      className="bg-slate-800 p-4 rounded-lg"
                    >
                      <div className="flex justify-between items-start">
                        <strong className="text-slate-100">
                          {review.name}
                        </strong>
                        <time className="text-sm text-slate-400">
                          {(review.createdAt || "").substring(0, 10)}
                        </time>
                      </div>

                      <div className="mt-2 text-slate-200">
                        {review.comment}
                      </div>

                      <div className="mt-3">
                        <Ratings value={review.rating} />
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tab 3: Related products */}
          {activeTab === 3 && (
            <div className="mt-1">
              {!data || data.length === 0 ? (
                <Loader />
              ) : (
                // Desktop: horizontal scroll row; sm+: grid (switches to grid on small screens)
                <div className="relative">
                  <div className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory sm:overflow-visible sm:snap-none sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {data.slice(0, 12).map((p) => (
                      <div
                        key={p._id}
                        className="flex-shrink-0 w-[16rem] snap-start sm:flex-shrink-0 sm:w-auto"
                      >
                        <SmallProduct product={p} />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductTabs;
