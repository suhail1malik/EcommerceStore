// frontend/src/pages/admin/AllProducts.jsx
import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { FaSearch, FaTimes, FaEdit, FaTrash, FaBoxOpen, FaLayerGroup } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { useAllProductsQuery, useDeleteProductMutation } from "../../redux/api/productApiSlice";
import Loader from "../../components/Loader";
import Message from "../../components/Message";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

const getImageUrl = (img) => {
  if (!img) return "https://via.placeholder.com/80x80/374151/9ca3af?text=No+Image";
  if (img.startsWith("http")) return img;
  return `${BASE_URL}${img}`;
};

const formatCurrency = (num) => {
  if (num == null) return "N/A";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(Number(num));
};

const ProductRow = ({ product, refetchProducts }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await deleteProduct(product._id).unwrap();
      toast.success("Product deleted successfully");
      if (refetchProducts) refetchProducts();
    } catch (err) {
      toast.error(err?.data?.message || err?.error || "Delete failed");
    }
  };

  return (
    <div className={`group bg-white dark:bg-slate-800 rounded-[20px] md:rounded-[24px] overflow-hidden border transition-all duration-500 ${
      isExpanded 
        ? "border-emerald-200 dark:border-emerald-500/30 shadow-xl ring-1 ring-emerald-100 dark:ring-emerald-500/20" 
        : "border-gray-200 dark:border-slate-700 shadow-sm hover:shadow-md hover:border-gray-300 dark:hover:border-slate-600"
    }`}>
      {/* Header Row */}
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 md:p-6 text-left hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
      >
        <div className="flex items-center gap-4 md:gap-6">
          <div className="relative w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl overflow-hidden bg-gray-100 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 shrink-0">
            <img 
              src={getImageUrl(product.image)} 
              alt={product.name} 
              className="w-full h-full object-cover"
              onError={(e) => { e.target.src = "https://via.placeholder.com/80x80/374151/9ca3af?text=No+Image"; }}
            />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
               <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                 {product.brand || "Unbranded"}
               </span>
               <div className={`w-1.5 h-1.5 rounded-full ${product.countInStock > 0 ? "bg-green-500" : "bg-red-500"}`} />
            </div>
            <h3 className="text-sm md:text-base font-bold text-gray-900 dark:text-slate-100 line-clamp-1 max-w-[200px] md:max-w-md">
              {product.name}
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-4 md:gap-8 min-w-0">
           <div className="hidden sm:block text-right">
              <p className="text-sm font-bold text-gray-900 dark:text-slate-200">{formatCurrency(product.price)}</p>
              <p className="text-[10px] font-bold tracking-widest uppercase text-gray-400 dark:text-gray-500">Price</p>
           </div>
           
           <div className={`hidden md:block px-3 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase truncate border ${
              product.category 
                ? "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-600" 
                : "bg-gray-50 dark:bg-slate-800 text-gray-400 border-gray-100 dark:border-slate-700"
           }`}>
              {product.category?.name || "Uncategorized"}
           </div>
        </div>
      </button>

      {/* Expanded Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="px-4 pb-6 md:px-8 md:pb-8 pt-2 border-t border-gray-100 dark:border-slate-700/50">
               <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mt-4">
                  
                  {/* Visual Preview */}
                  <div className="lg:col-span-4 relative aspect-[4/3] rounded-2xl overflow-hidden bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-700/50 group/img">
                    <img
                      src={getImageUrl(product.image)}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover/img:scale-105"
                      onError={(e) => { e.target.src = "https://via.placeholder.com/80x80/374151/9ca3af?text=No+Image"; }}
                    />
                    <div className="absolute top-4 left-4">
                      <span className={`px-3 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest backdrop-blur-md border ${
                        product.countInStock > 0 
                          ? "bg-green-500/90 text-white border-green-400 shadow-lg" 
                          : "bg-red-500/90 text-white border-red-400"
                      }`}>
                        {product.countInStock > 0 ? `${product.countInStock} In Stock` : "Depleted"}
                      </span>
                    </div>
                  </div>

                  {/* Details & Actions */}
                  <div className="lg:col-span-8 flex flex-col h-full">
                    <div className="mb-6">
                      <h4 className="text-sm font-bold text-gray-900 dark:text-slate-100 mb-2">
                        Product Description
                      </h4>
                      <p className="text-xs md:text-sm text-gray-500 dark:text-slate-400 leading-relaxed italic line-clamp-4">
                        "{product.description || "No description provided."}"
                      </p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
                       <div className="p-3 bg-gray-50 dark:bg-slate-900/50 rounded-xl border border-gray-100 dark:border-slate-700/50">
                          <div className="flex items-center gap-2 mb-1">
                             <FaLayerGroup className="w-3 h-3 text-gray-400" />
                             <p className="text-[9px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest">Category</p>
                          </div>
                          <p className="text-xs font-bold text-gray-700 dark:text-slate-300 truncate">{product.category?.name || "N/A"}</p>
                       </div>
                       <div className="p-3 bg-gray-50 dark:bg-slate-900/50 rounded-xl border border-gray-100 dark:border-slate-700/50">
                          <div className="flex items-center gap-2 mb-1">
                             <FaBoxOpen className="w-3 h-3 text-gray-400" />
                             <p className="text-[9px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest">Inventory</p>
                          </div>
                          <p className="text-xs font-bold text-gray-700 dark:text-slate-300 truncate">{product.countInStock} units</p>
                       </div>
                    </div>

                    {/* Action Bar Modifier */}
                    <div className="mt-auto flex flex-col sm:flex-row items-center gap-3 pt-6 border-t border-gray-100 dark:border-slate-700/50">
                       <Link
                          to={`/admin/product/update/${product._id}`}
                          className="flex-1 w-full text-center sm:text-left sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-gray-900 dark:bg-emerald-600 text-white hover:bg-black dark:hover:bg-emerald-700 rounded-xl text-sm font-bold transition-all shadow-lg shadow-gray-900/10 dark:shadow-emerald-900/20 active:scale-95"
                       >
                          <FaEdit className="w-4 h-4" />
                          Modify Spec Listing
                       </Link>
                       
                       <button
                          onClick={handleDelete}
                          disabled={isDeleting}
                          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/30 rounded-xl text-sm font-bold transition-all active:scale-95 disabled:opacity-50"
                       >
                          <FaTrash className="w-4 h-4" />
                          Delete Catalog Entry
                       </button>
                    </div>
                  </div>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const AllProducts = () => {
  const { data: products = [], isLoading, isError, refetch } = useAllProductsQuery();
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products;
    return products.filter(
      (p) =>
        (p.name || "").toLowerCase().includes(q) ||
        (p.brand || "").toLowerCase().includes(q)
    );
  }, [products, query]);

  if (isLoading)
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 w-full space-y-4">
        {[1,2,3,4].map(n => (
           <div key={n} className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-[24px] p-6 h-[90px] animate-pulse flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-100 dark:bg-slate-700 rounded-xl" />
              <div>
                <div className="w-32 h-4 bg-gray-100 dark:bg-slate-700 rounded mb-2" />
                <div className="w-24 h-3 bg-gray-100 dark:bg-slate-700 rounded" />
              </div>
           </div>
        ))}
      </div>
    );

  if (isError)
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <Message variant="danger">
          Error loading products — check console / network.
        </Message>
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
           <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-100 tracking-tight">Curated Catalog</h1>
           <p className="text-sm text-gray-500 dark:text-slate-400 mt-2 font-medium">Manage and modify inventory items.</p>
        </div>
        <div className="relative group w-full md:w-80">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
          <input 
            type="text" 
            placeholder="Search catalog models..." 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-11 pr-10 py-3 bg-white dark:bg-slate-800 border-2 border-gray-200 dark:border-slate-700 rounded-[16px] text-sm font-medium focus:outline-none focus:border-emerald-500 dark:focus:border-emerald-500 transition-all w-full text-gray-900 dark:text-slate-100"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
            >
              <FaTimes className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {filtered.map((product) => (
          <ProductRow key={product._id} product={product} refetchProducts={refetch} />
        ))}
        {filtered.length === 0 && (
           <div className="py-20 text-center">
             <div className="w-16 h-16 bg-gray-50 dark:bg-slate-800 text-gray-300 dark:text-slate-600 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-gray-100 dark:border-slate-700">
               <FaSearch className="w-6 h-6" />
             </div>
             <p className="text-gray-400 dark:text-slate-500 font-medium">No matching models found.</p>
           </div>
        )}
      </div>
    </div>
  );
};

export default AllProducts;
