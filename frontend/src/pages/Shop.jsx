// Shop.jsx  (refactored + commented)
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetFilteredProductsQuery } from "../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../redux/api/categoryApiSlice";
import { FiFilter, FiX } from "react-icons/fi";

import {
  setCategories,
  setProducts,
  setChecked,
  setRadio, // if you have action to set radio/sort in your slice (optional)
} from "../redux/features/shop/shopSlice";
import Loader from "../components/Loader";
import SkeletonProductCard from "../components/SkeletonProductCard";
import ProductCard from "./Products/ProductCard";

/*
  Key UX/structure changes:
  - Sidebar is narrower (lg:w-72) to avoid taking too much page width.
  - Collapsible sections use <details> for simple accessible accordions.
  - Reset now clears redux + local state (no reload).
  - Mobile drawer has explicit Apply button (user expects to apply filters).
  - Product sorting uses local state, done in render like before.
*/

const Shop = () => {
  const dispatch = useDispatch();

  // Read values from redux shop slice
  const { categories, products, checked, radio } = useSelector(
    (state) => state.shop
  );

  // Fetch categories and products (products depend on selected categories via checked)
  const { data: categoryData, isLoading: categoryLoading } =
    useFetchCategoriesQuery();
  const { data: productData, isLoading: productLoading, isFetching: productFetching } =
    useGetFilteredProductsQuery({ checked, radio });

  // Local UI state
  const [priceFilter, setPriceFilter] = useState(""); // e.g. "100" or "50-200" if you later accept ranges
  const [searchTerm, setSearchTerm] = useState("");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [tempBrand, setTempBrand] = useState(""); // temporary brand selection in drawer (apply only on click)
  const [selectedBrand, setSelectedBrand] = useState(""); // active brand filter
  const [sortBy, setSortBy] = useState("relevance");

  // 1) When categories arrive, store them in redux
  useEffect(() => {
    if (categoryData) dispatch(setCategories(categoryData));
  }, [categoryData, dispatch]);

  // 2) When productData OR selected client-side filters change, apply client-side filtering
  useEffect(() => {
    if (!productData) return;

    let filtered = [...productData];

    // If a brand is selected, filter by brand (case-insensitive)
    if (selectedBrand) {
      filtered = filtered.filter(
        (p) =>
          p.brand &&
          p.brand.toString().toLowerCase() ===
            selectedBrand.toString().toLowerCase()
      );
    }

    // Price filter: try to treat input as a number and filter by price <= entered value.
    // (You can replace with range logic later.)
    const priceNum = Number(priceFilter);
    if (priceFilter && !Number.isNaN(priceNum)) {
      filtered = filtered.filter((p) => (Number(p.price) || 0) <= priceNum);
    }

    if (searchTerm) {
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Dispatch filtered results to redux so UI (and other components) can read from same source
    dispatch(setProducts(filtered));
  }, [productData, priceFilter, selectedBrand, searchTerm, dispatch]);

  // Toggle category check (same as before)
  const handleCheck = (checkedState, id) => {
    const updated = checkedState
      ? [...checked, id]
      : checked.filter((c) => c !== id);
    dispatch(setChecked(updated));
  };

  // Called when user clicks brand option in sidebar (applies immediately)
  const handleBrandClick = (brand) => {
    setSelectedBrand(brand);
  };

  // For mobile drawer: user can change tempBrand and then click Apply to set selectedBrand
  const applyMobileFilters = () => {
    setSelectedBrand(tempBrand);
    setMobileFiltersOpen(false);
  };

  // Reset filters (does NOT reload page). Clears client and redux filters.
  const resetFilters = () => {
    setPriceFilter("");
    setSelectedBrand("");
    setTempBrand("");
    setSortBy("relevance");
    setSearchTerm("");
    // Clear checked categories in redux
    dispatch(setChecked([]));
    // Optionally clear products back to productData (or refetch)
    dispatch(setProducts(productData || []));
    // If you have a radio state in redux (sort) you can dispatch setRadio(null) or similar
    // dispatch(setRadio(null));
  };

  // Generate unique brands from productData (safe guard if productData is undefined)
  const uniqueBrands = [
    ...new Set(
      (productData || [])
        .map((p) => p.brand)
        .filter((b) => b && b.toString().trim() !== "")
    ),
  ];

  return (
    <div className="w-full px-2 sm:px-4 lg:px-6 py-4">
      {/* Top bar (compact) */}
      <div className="flex items-center justify-between mb-3 gap-3">
        {/* Mobile filter button (visible on small screens only) */}
        <div className="flex items-center gap-2">
          {/* Active filter count */}
          <div className="text-sm text-slate-600 dark:text-slate-300 hidden md:block">
            {selectedBrand || priceFilter || checked?.length > 0 ? (
              <span>
                {(checked?.length || 0) +
                  (selectedBrand ? 1 : 0) +
                  (priceFilter ? 1 : 0)}{" "}
                filters
              </span>
            ) : (
              <span className="text-slate-500 dark:text-slate-400">No filters</span>
            )}
          </div>

          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="lg:hidden inline-flex items-center gap-2 rounded-md border border-slate-300 dark:border-slate-700 px-3 py-1.5 text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 text-sm"
            aria-label="Open filters"
          >
            <FiFilter /> Filters
          </button>
        </div>

        <h2 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-slate-100">
          {products?.length || 0} Products
        </h2>
      </div>

      {/* Active filters chips (click to remove) */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        {selectedBrand && (
          <button
            onClick={() => setSelectedBrand("")}
            className="rounded-full bg-emerald-600/10 text-emerald-400 border border-emerald-600/30 px-3 py-1 text-xs"
          >
            Brand: {selectedBrand} ✕
          </button>
        )}
        {priceFilter && (
          <button
            onClick={() => setPriceFilter("")}
            className="rounded-full bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-600 px-3 py-1 text-xs"
          >
            Price ≤ {priceFilter} ✕
          </button>
        )}
        {checked?.map((id) => {
          const cat = categories?.find((c) => c._id === id);
          if (!cat) return null;
          return (
            <button
              key={id}
              onClick={() =>
                dispatch(setChecked(checked.filter((c) => c !== id)))
              }
              className="rounded-full bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-600 px-3 py-1 text-xs"
            >
              {cat.name} ✕
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
        {/* Sidebar (desktop only). Narrow width (lg:w-72 via grid column) */}
        <aside className="hidden lg:block">
          {/* sticky so filters remain visible while scrolling */}
          <div className="sticky top-20 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-lg p-5 max-h-[75vh] overflow-y-auto shadow-sm dark:shadow-none">
            {/* Search items */}
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-2">Search Items</h3>
            <input
              type="text"
              placeholder="Search specific product..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full mb-5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
            />

            {/* Sort */}
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-2">Sort</h3>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full mb-5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
            >
              <option value="relevance">Relevance</option>
              <option value="priceAsc">Price: Low to High</option>
              <option value="priceDesc">Price: High to Low</option>
              <option value="ratingDesc">Rating</option>
              <option value="newest">Newest</option>
            </select>

            {/* Categories: collapsible */}
            <details className="mb-5" open>
              <summary className="cursor-pointer text-sm font-semibold text-slate-800 dark:text-slate-200 mb-3">
                Categories
              </summary>
              <div className="mt-2 space-y-2 text-sm">
                {categoryLoading ? (
                  <Loader />
                ) : (
                  categories?.map((c) => (
                      <label
                      key={c._id}
                      className="flex items-center gap-3 text-slate-700 dark:text-slate-200 text-sm hover:text-emerald-600 dark:hover:text-emerald-400 cursor-pointer transition-colors"
                    >
                      {/* checkbox uses checked array from redux */}
                      <input
                        type="checkbox"
                        checked={checked?.includes(c._id)}
                        onChange={(e) => handleCheck(e.target.checked, c._id)}
                        className="w-4 h-4 text-emerald-600 rounded border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 focus:ring-emerald-500"
                      />
                      <span>{c.name}</span>
                    </label>
                  ))
                )}
              </div>
            </details>

            {/* Brands: collapsible */}
            <details className="mb-5">
              <summary className="cursor-pointer text-sm font-semibold text-slate-800 dark:text-slate-200 mb-3">
                Brands
              </summary>
              <div className="mt-2 space-y-3 text-sm">
                {uniqueBrands.length === 0 ? (
                  <div className="text-slate-500 dark:text-slate-400 text-xs">No brands</div>
                ) : (
                  uniqueBrands.map((brand) => (
                    <label
                      key={brand}
                      className="flex items-center gap-3 text-slate-700 dark:text-slate-200 text-sm hover:text-emerald-600 dark:hover:text-emerald-400 cursor-pointer transition-colors"
                    >
                      <input
                        type="radio"
                        name="brand"
                        checked={selectedBrand === brand}
                        onChange={() => handleBrandClick(brand)}
                        className="w-4 h-4 text-emerald-600 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 focus:ring-emerald-500"
                      />
                      <span className="capitalize">{brand}</span>
                    </label>
                  ))
                )}
              </div>
            </details>

            {/* Price */}
            <details className="mb-5">
              <summary className="cursor-pointer text-sm font-semibold text-slate-800 dark:text-slate-200 mb-3">
                Price
              </summary>
              <div className="mt-2">
                {/* Numeric input is better than text for price */}
                <input
                  type="number"
                  placeholder="Max price"
                  value={priceFilter}
                  onChange={(e) => setPriceFilter(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
                />
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                  Showing products with price ≤ value
                </div>
              </div>
            </details>

            {/* Actions: Apply (not necessary for desktop because filters auto-apply), Reset */}
            <div className="flex gap-2 mt-6">
              <button
                onClick={resetFilters}
                className="flex-1 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-100 font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Reset
              </button>
              {/* Optionally a save or apply button if you want manual apply */}
            </div>
          </div>
        </aside>

        {/* Products grid */}
        <section className="flex-1 w-full min-w-0 relative">
          {productFetching && !productLoading && (
            <div className="absolute top-0 right-0 p-2">
              <span className="flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
            </div>
          )}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-4 md:gap-5">
            {productLoading ? (
              [1, 2, 3, 4, 5, 6, 7, 8].map((n) => <SkeletonProductCard key={n} />)
            ) : (
              [...(products || [])]
                .sort((a, b) => {
                  if (sortBy === "priceAsc")
                    return (a.price || 0) - (b.price || 0);
                  if (sortBy === "priceDesc")
                    return (b.price || 0) - (a.price || 0);
                  if (sortBy === "ratingDesc")
                    return (b.rating || 0) - (a.rating || 0);
                  if (sortBy === "newest")
                    return (
                       new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
                    );
                  return 0;
                })
                .map((p) => <ProductCard key={p._id} product={p} />)
            )}
          </div>
        </section>
      </div>

      {/* Mobile filters drawer (explicit apply) */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-[150]">
          {/* dark overlay closes drawer on click */}
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setMobileFiltersOpen(false)}
          />
          <div className="absolute right-0 top-0 h-full w-80 max-w-[85%] bg-white dark:bg-[#0b0c0e] border-l border-slate-200 dark:border-slate-800 p-5 overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Filters</h3>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="p-2 text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                aria-label="Close filters"
              >
                <FiX size={20} />
              </button>
            </div>

            {/* Search items (mobile) */}
            <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-2">Search Items</h4>
            <input
              type="text"
              placeholder="Search specific product..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full mb-6 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
            />

            {/* Sort (mobile) */}
            <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-2">Sort</h4>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full mb-6 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="relevance">Relevance</option>
              <option value="priceAsc">Price: Low to High</option>
              <option value="priceDesc">Price: High to Low</option>
              <option value="ratingDesc">Rating</option>
              <option value="newest">Newest</option>
            </select>

            {/* Categories (mobile) */}
            <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-3">
              Categories
            </h4>
            {categoryLoading ? (
              <Loader />
            ) : (
              <div className="space-y-3 mb-6">
                {categories?.map((c) => (
                  <label
                    key={c._id}
                    className="flex items-center gap-3 text-slate-700 dark:text-slate-200 text-sm"
                  >
                    <input
                      type="checkbox"
                      checked={checked?.includes(c._id)}
                      onChange={(e) => handleCheck(e.target.checked, c._id)}
                      className="w-4 h-4 text-emerald-600 rounded border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 focus:ring-emerald-500"
                    />
                    {c.name}
                  </label>
                ))}
              </div>
            )}

            {/* Brands (mobile) - uses tempBrand until Apply is clicked */}
            <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-3">
              Brands
            </h4>
            <div className="space-y-3 mb-6">
              {uniqueBrands?.map((brand) => (
                <label
                  key={brand}
                  className="flex items-center gap-3 text-slate-700 dark:text-slate-200 text-sm"
                >
                  <input
                    type="radio"
                    name="brand-mobile"
                    checked={tempBrand === brand}
                    onChange={() => setTempBrand(brand)}
                    className="w-4 h-4 text-emerald-600 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 focus:ring-emerald-500"
                  />
                  {brand}
                </label>
              ))}
            </div>

            {/* Price mobile (temp as well) */}
            <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-2">Price</h4>
            <input
              type="number"
              placeholder="Max price"
              value={priceFilter}
              onChange={(e) => setPriceFilter(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 mb-6"
            />

            {/* Mobile actions: Apply and Reset */}
            <div className="flex gap-3 mt-4">
              <button
                onClick={applyMobileFilters}
                className="flex-1 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition"
              >
                Apply
              </button>
              <button
                onClick={resetFilters}
                className="flex-1 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-100 font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Shop;
