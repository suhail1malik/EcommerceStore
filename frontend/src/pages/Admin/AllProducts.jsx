// frontend/src/pages/admin/AllProducts.jsx
import React from "react";
import { Link } from "react-router-dom";
// import moment from "moment";
import { useAllProductsQuery } from "../../redux/api/productApiSlice";
import AdminMenu from "./AdminMenu";
import ProductCard from "../Products/ProductCard"; // use the improved card below

const AllProducts = () => {
  const { data: products = [], isLoading, isError } = useAllProductsQuery();

  if (isLoading)
    return (
      <div className="p-8 text-center">
        <div className="inline-block animate-pulse px-6 py-3 bg-gray-800/60 rounded-md text-white">
          Loading products...
        </div>
      </div>
    );

  if (isError)
    return (
      <div className="p-8 text-center text-red-400">
        Error loading products — check console / network.
      </div>
    );

  return (
    <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main grid */}
        <main className="flex-1">
          <header className="mb-6">
            <h1 className="text-2xl font-semibold text-slate-100">
              All Products ({products.length})
            </h1>
            <p className="mt-2 text-sm text-slate-400">
              Manage and update items in your store
            </p>
          </header>

          <section>
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </section>
        </main>

        {/* Sidebar */}
        <aside className="w-full lg:w-72">
          <div className="sticky top-6">
            <AdminMenu />
          </div>
        </aside>
      </div>
    </div>
  );
};

export default AllProducts;
