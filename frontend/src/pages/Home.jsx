import React from "react";

import { useParams } from "react-router-dom";
import { useGetProductsQuery } from "../redux/api/productApiSlice";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Product from "../pages/Products/Product";
import HeroSection from "../components/HeroSection";
import CategoryStrip from "../components/CategoryStrip";
import TopRow from "../components/TopRow";

const Home = () => {
  const { keyword } = useParams();
  const { data, isLoading, isError, error } = useGetProductsQuery({ keyword });

  return (
    <>
      {!keyword && (
        <>
          <HeroSection />
          <CategoryStrip />
          <TopRow />
        </>
      )}
      {isLoading ? (
        <Loader />
      ) : isError ? (
        <Message variant="error">
          {error?.data?.message ||
            error?.error ||
            "An error occurred while fetching products"}
        </Message>
      ) : (
        <>
          {/* Products Grid */}
          <div className="w-full px-4 sm:px-6 lg:px-12 py-8 sm:py-12 lg:max-w-[1600px] lg:mx-auto">
            <div className="flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between mb-4">
              <h2 className="text-lg sm:text-2xl font-semibold">
                All Products
              </h2>
              <div className="text-sm md:text-base text-slate-500">
                {data?.products?.length || 0} items
              </div>
            </div>
            {data?.products?.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-y-6 gap-x-6">
                {data.products.map((product) => (
                  <Product key={product._id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-400 text-lg">No products found.</p>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default Home;
