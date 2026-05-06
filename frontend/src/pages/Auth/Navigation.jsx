// src/components/Navigation.jsx
import React, { useEffect, useRef, useState } from "react";
import {
  AiOutlineHome,
  AiOutlineShopping,
  AiOutlineShoppingCart,
  AiOutlineLogin,
  AiOutlineUserAdd,
  AiOutlineClose,
  AiOutlineSearch,
} from "react-icons/ai";
import { FaHeart } from "react-icons/fa";
import { GiHamburgerMenu } from "react-icons/gi";
import { BsSun, BsMoon } from "react-icons/bs";
import { MdLocationOn } from "react-icons/md";
import { useGetProductsQuery } from "../../redux/api/productApiSlice";
import { useDebounce } from "../../hooks/useDebounce";
import { getImageSource } from "../../utils/images";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useTheme } from "../../components/ThemeProvider";
import { useLogoutMutation } from "../../redux/api/usersApiSlice";
import { logout } from "../../redux/features/auth/authSlice";
import FavoritesCount from "../Products/FavoritesCount";

const Navigation = () => {
  const { theme, toggleTheme } = useTheme();
  const { userInfo } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);

  const [searchTerm, setSearchTerm] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const { data: searchData, isFetching: isSearching } = useGetProductsQuery(
    { keyword: debouncedSearchTerm },
    { skip: !debouncedSearchTerm || debouncedSearchTerm.length < 2 || !showSuggestions }
  );

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [locationLabel, setLocationLabel] = useState("Your area");
  const [locating, setLocating] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [logoutApiCall] = useLogoutMutation();

  const [scrolled, setScrolled] = useState(false);
  
  const dropdownRef = useRef(null);
  const mobileRef = useRef(null);
  const toggleBtnRef = useRef(null);

  // Handle scroll shadow
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menus when route changes
  useEffect(() => {
    setDropdownOpen(false);
    setMobileOpen(false);
  }, [location.pathname]);

  // Document-level handlers: attach once
  useEffect(() => {
    function handleDocClick(e) {
      const target = e.target;

      // If clicked inside dropdown / mobile menu / toggle button -> do nothing
      if (dropdownRef.current && dropdownRef.current.contains(target)) return;
      if (mobileRef.current && mobileRef.current.contains(target)) return;
      if (toggleBtnRef.current && toggleBtnRef.current.contains(target)) return;

      setDropdownOpen(false);
      setMobileOpen(false);
      setShowSuggestions(false);
    }

    function handleEsc(e) {
      if (e.key === "Escape") {
        setDropdownOpen(false);
        setMobileOpen(false);
      }
    }

    document.addEventListener("click", handleDocClick);
    document.addEventListener("keydown", handleEsc);

    return () => {
      document.removeEventListener("click", handleDocClick);
      document.removeEventListener("keydown", handleEsc);
    };
  }, []); // <-- attach once (important)

  // Load cached user location if it exists
  useEffect(() => {
    const saved = localStorage.getItem("userLocationLabel");
    if (saved) {
      setLocationLabel(saved);
    }
  }, []);

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };

  const submitSearch = (e) => {
    e?.preventDefault();
    const q = searchTerm.trim();
    if (q) {
      navigate(`/shop?search=${encodeURIComponent(q)}`);
      setShowSuggestions(false);
    } else {
      navigate("/shop");
    }
    setMobileOpen(false);
  };

  const detectLocation = () => {
    setLocating(true);
    if (!("geolocation" in navigator)) {
      setLocating(false);
      alert("Geolocation is not supported by your browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        fetch(
          `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`,
          { headers: { Accept: "application/json" } }
        )
          .then((r) => r.json())
          .then((data) => {
            const a = data?.address || {};
            const city =
              a.city ||
              a.town ||
              a.village ||
              a.suburb ||
              a.neighbourhood ||
              a.state ||
              "Your location";
            const pincode = a.postcode || "";
            const label = pincode ? `${city} ${pincode}` : city;
            setLocationLabel(label);
            localStorage.setItem("userLocationLabel", label);
          })
          .catch(() => {})
          .finally(() => setLocating(false));
      },
      (error) => {
        console.error("Location error:", error);
        setLocating(false);
        alert("Failed to detect location. Please check permissions.");
      },
      { timeout: 8000 }
    );
  };

  return (
    <>
      <nav className={`sticky top-0 z-[100] w-full transition-all duration-300 ${
        scrolled 
          ? "bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-200 dark:border-white/5 shadow-lg shadow-black/5" 
          : "bg-transparent border-b border-transparent"
      }`}>
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: brand + badges */}
        <div className="flex items-center gap-4 text-slate-800 dark:text-white shrink-0">
          <Link
            to="/"
            className="font-extrabold text-2xl tracking-tight text-slate-900 dark:text-white hover:opacity-80 transition-all flex items-center gap-1"
          >
            Commerce<span className="bg-gradient-to-r from-indigo-500 to-emerald-500 bg-clip-text text-transparent">Hub</span>
          </Link>

          <button
            title="Detect location"
            onClick={detectLocation}
            aria-label="Detect location"
            className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-md bg-slate-200 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 text-sm hover:bg-slate-300 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white transition"
          >
            <MdLocationOn className="text-emerald-600 dark:text-emerald-500 text-lg" />
            {locating ? "Detecting..." : locationLabel}
          </button>

          <div className="hidden md:flex items-center gap-7">
            {[
              { to: "/", icon: AiOutlineHome, label: "Home" },
              { to: "/shop", icon: AiOutlineShopping, label: "Shop" },
              { to: "/my-orders", icon: AiOutlineShopping, label: "Orders", protected: true },
              { to: "/favorite", icon: FaHeart, label: "Favorites", extra: <FavoritesCount /> },
            ].map((link) => {
              if (link.protected && !userInfo) return null;
              const isActive = location.pathname === link.to;
              const Icon = link.icon;
              
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`group relative flex items-center gap-2 py-2 transition-all duration-300 ${
                    isActive ? "text-emerald-500 font-bold" : "text-slate-600 dark:text-slate-300 hover:text-emerald-500"
                  }`}
                >
                  <span className="relative">
                    <Icon className={`text-xl transition-transform duration-300 group-hover:scale-110 ${isActive ? 'scale-110' : ''}`} />
                    {link.extra && <span className="absolute -top-1 -right-1">{link.extra}</span>}
                  </span>
                  <span className="hidden sm:inline text-sm tracking-wide">{link.label}</span>
                  
                  {/* Underline Animation */}
                  <span className={`absolute bottom-0 left-0 h-0.5 bg-emerald-500 transition-all duration-300 ${
                    isActive ? "w-full" : "w-0 group-hover:w-full"
                  }`} />
                </Link>
              );
            })}
          </div>
        </div>

        {/* Center: Desktop Search */}
        <div className="hidden lg:flex flex-1 max-w-md mx-4">
           <form onSubmit={submitSearch} className="relative w-full group">
              <AiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setShowSuggestions(true);
                }}
                placeholder="Search premium goods..."
                className="w-full pl-11 pr-4 py-2 bg-slate-100 dark:bg-slate-800/50 border border-transparent focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-900 rounded-full text-sm outline-none transition-all"
              />
              {/* Desktop Predictive Dropdown */}
              {debouncedSearchTerm && showSuggestions && (searchData?.products?.length > 0 || isSearching) && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden z-[60]">
                   {isSearching ? (
                     <div className="p-4 text-center text-xs text-slate-500">Searching...</div>
                   ) : (
                     <div className="max-h-[400px] overflow-y-auto py-2">
                        {searchData.products.slice(0, 5).map(p => (
                          <Link 
                            key={p._id} 
                            to={`/product/${p._id}`} 
                            onClick={() => {
                              setSearchTerm("");
                              setShowSuggestions(false);
                            }}
                            className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors border-b border-slate-50 dark:border-slate-800/50 last:border-0"
                          >
                             <img src={getImageSource(p.image)} alt={p.name} className="w-10 h-10 rounded-lg object-cover bg-slate-100" />
                             <div className="flex-1 overflow-hidden">
                                <p className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate">{p.name}</p>
                                <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest">{p.brand}</p>
                             </div>
                             <p className="text-sm font-black text-slate-900 dark:text-white">₹{p.price}</p>
                          </Link>
                        ))}
                        <Link to={`/shop?keyword=${debouncedSearchTerm}`} className="block text-center py-2 text-xs font-bold text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition-colors">
                           View All Results →
                        </Link>
                     </div>
                   )}
                </div>
              )}
           </form>
        </div>

        {/* Right: actions */}
        <div className="flex items-center gap-2 sm:gap-3 ml-auto">
          {/* Cart */}
          <Link
            to="/cart"
            className={`relative transition-colors ${location.pathname === '/cart' ? 'text-emerald-500' : 'text-slate-800 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400'}`}
            aria-label="View Cart"
          >
            <AiOutlineShoppingCart className="text-xl" />
            {cartItems.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-emerald-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-[11px]">
                {cartItems.reduce((a, c) => a + c.qty, 0)}
              </span>
            )}
          </Link>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            title={
              theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
            }
            className="rounded-md p-2 text-slate-500 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            {theme === "dark" ? <BsSun size={18} /> : <BsMoon size={18} />}
          </button>

          {/* User / login */}
          {userInfo ? (
            <div className="relative hidden md:block" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen((v) => !v)}
                className={`flex items-center gap-2 transition-colors ${location.pathname.startsWith('/admin') || location.pathname === '/profile' ? 'text-emerald-500 font-semibold' : 'text-slate-800 dark:text-white hover:text-emerald-500 dark:hover:text-emerald-400'}`}
                aria-haspopup="menu"
                aria-expanded={dropdownOpen}
                aria-label="User menu"
              >
                {userInfo.profilePic ? (
                  <img 
                    src={userInfo.profilePic} 
                    alt="Profile" 
                    className="w-8 h-8 rounded-full object-cover border border-emerald-500/20" 
                  />
                ) : (
                  <span className="hidden sm:inline">{userInfo.username}</span>
                )}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-4 w-4 transition-transform duration-200 ${
                    dropdownOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {dropdownOpen && (
                <ul
                  className="absolute right-0 mt-2 w-56 bg-[#111] text-white rounded-md shadow-lg py-2 z-50 border border-gray-700"
                  role="menu"
                  aria-label="User menu"
                >
                  {userInfo.isAdmin && (
                    <>
                      <li>
                        <Link
                          to="/admin"
                          className="block px-4 py-2 hover:bg-gray-800"
                        >
                          Admin Dashboard
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/admin/addProducts"
                          className="block px-4 py-2 hover:bg-gray-800"
                        >
                          Add Products
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/admin/categories"
                          className="block px-4 py-2 hover:bg-gray-800"
                        >
                          Categories
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/admin/all-products"
                          className="block px-4 py-2 hover:bg-gray-800"
                        >
                          All Products
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/admin/users"
                          className="block px-4 py-2 hover:bg-gray-800"
                        >
                          Users
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/admin/orders"
                          className="block px-4 py-2 hover:bg-gray-800"
                        >
                          Orders
                        </Link>
                      </li>
                      <li className="border-t border-gray-700 my-1" />
                    </>
                  )}
                  <li>
                    <Link
                      to="/my-orders"
                      className="block px-4 py-2 hover:bg-gray-800"
                    >
                      My Orders
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/profile"
                      className="block px-4 py-2 hover:bg-gray-800"
                    >
                      Profile
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={logoutHandler}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-800"
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              )}
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-3 text-slate-800 dark:text-white">
              <Link
                to="/login"
                className="flex items-center gap-1 hover:text-emerald-600 dark:hover:text-emerald-400 transition"
              >
                <AiOutlineLogin className="text-xl" />
                <span className="hidden sm:inline">Login</span>
              </Link>
              <Link
                to="/register"
                className="flex items-center gap-1 hover:text-emerald-400"
              >
                <AiOutlineUserAdd className="text-xl" />
                <span className="hidden sm:inline">Register</span>
              </Link>
            </div>
          )}

          {/* Mobile toggle */}
          <button
            ref={toggleBtnRef}
            className="md:hidden text-slate-800 dark:text-white p-2 hover:text-emerald-500"
            aria-label="Toggle menu"
            onClick={(e) => {
              // prevent the document click handler from seeing this click
              e.stopPropagation();
              setMobileOpen((v) => !v);
            }}
          >
            {mobileOpen ? (
              <AiOutlineClose size={20} />
            ) : (
              <GiHamburgerMenu size={20} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Search Bar Always Visible */}
      <div className="md:hidden px-4 pb-4">
        <form onSubmit={submitSearch} className="relative group flex gap-2">
          <div className="relative flex-1">
            <AiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 text-lg group-focus-within:text-emerald-500 transition-colors" />
            <input
              type="search"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setShowSuggestions(true);
              }}
              placeholder="Search specific item..."
              className="w-full pl-11 pr-11 py-2.5 bg-slate-100/90 dark:bg-slate-800/60 backdrop-blur-sm border border-transparent focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-900 rounded-full text-[15px] text-slate-900 dark:text-gray-100 placeholder:text-slate-500 dark:placeholder:text-gray-400 outline-none transition-all shadow-inner"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-500 transition-colors p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700"
              >
                <AiOutlineClose size={14} />
              </button>
            )}
            {/* Mobile Predictive Dropdown */}
            {debouncedSearchTerm && showSuggestions && (searchData?.products?.length > 0 || isSearching) && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden z-[60]">
                 {isSearching ? (
                   <div className="p-4 text-center text-xs text-slate-500 font-medium">Seeking products...</div>
                 ) : (
                   <div className="max-h-[300px] overflow-y-auto py-1">
                      {searchData.products.slice(0, 4).map(p => (
                        <Link 
                          key={p._id} 
                          to={`/product/${p._id}`} 
                          onClick={() => {
                            setSearchTerm("");
                            setShowSuggestions(false);
                          }}
                          className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors border-b border-slate-50 dark:border-slate-800/50 last:border-0"
                        >
                           <img src={getImageSource(p.image)} alt={p.name} className="w-10 h-10 rounded-lg object-cover bg-slate-100" />
                           <div className="flex-1 overflow-hidden">
                              <p className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">{p.name}</p>
                              <p className="text-[10px] text-emerald-500 font-bold">{p.brand}</p>
                           </div>
                           <p className="text-xs font-bold text-slate-900 dark:text-white">₹{p.price}</p>
                        </Link>
                      ))}
                      <Link to={`/shop?keyword=${debouncedSearchTerm}`} onClick={() => setSearchTerm("")} className="block text-center py-3 text-xs font-bold text-emerald-500 bg-emerald-50/50 dark:bg-emerald-500/5">
                         All Results ({searchData.products.length})
                      </Link>
                   </div>
                 )}
              </div>
            )}
          </div>
          <button 
            type="submit" 
            className="w-10 h-10 shrink-0 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full flex items-center justify-center shadow-md transition-all active:scale-90"
            aria-label="Search"
          >
            <AiOutlineSearch size={20} />
          </button>
        </form>
      </div>



      {/* Mobile menu */}
      {mobileOpen && (
        <div
          ref={mobileRef}
          className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-3xl z-50 shadow-2xl"
        >
          <div className="px-4 py-3 space-y-3 text-slate-800 dark:text-white">
            <Link to="/" className="flex items-center gap-2">
              <AiOutlineHome className="text-lg" /> Home
            </Link>
            <Link to="/shop" className="flex items-center gap-2">
              <AiOutlineShopping className="text-lg" /> Shop
            </Link>
            <Link to="/favorite" className="flex items-center gap-2">
              <FaHeart className="text-lg" /> Favorites
            </Link>
            <Link to="/cart" className="flex items-center gap-2">
              <AiOutlineShoppingCart className="text-lg" /> Cart
            </Link>
            {userInfo && (
              <Link to="/my-orders" className="flex items-center gap-2">
                <AiOutlineShopping className="text-lg" /> My Orders
              </Link>
            )}

            {userInfo ? (
              <>
                <Link to="/profile" className="block py-2">
                  Profile
                </Link>
                {userInfo.isAdmin && (
                  <div className="pt-2 border-t border-slate-800">
                    <Link to="/admin" className="block py-2">
                      Admin Dashboard
                    </Link>
                    <Link to="/admin/addProducts" className="block py-2">
                      Add Products
                    </Link>
                    <Link to="/admin/categories" className="block py-2">
                      Categories
                    </Link>
                    <Link to="/admin/all-products" className="block py-2">
                      All Products
                    </Link>
                    <Link to="/admin/users" className="block py-2">
                      Users
                    </Link>
                    <Link to="/admin/orders" className="block py-2">
                      Orders
                    </Link>
                  </div>
                )}
                <button
                  onClick={logoutHandler}
                  className="w-full text-left py-2"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/login" className="flex items-center gap-1">
                  <AiOutlineLogin /> Login
                </Link>
                <Link to="/register" className="flex items-center gap-1">
                  <AiOutlineUserAdd /> Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
      </nav>

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-white/95 dark:bg-zinc-950/95 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 z-[100] pb-safe" style={{ transform: "translateZ(0)" }}>
        <div className="flex items-center justify-around h-14">
          <Link to="/" className={`flex flex-col items-center justify-center gap-1 w-full h-full transition-all active:scale-90 ${location.pathname === '/' ? 'text-emerald-500 dark:text-emerald-400 font-bold' : 'text-slate-500 dark:text-slate-400 hover:text-emerald-500 dark:hover:text-emerald-400'}`}>
            <AiOutlineHome size={20} className={location.pathname === '/' ? 'scale-110' : ''} />
            <span className="text-[10px] font-medium tracking-tight">Home</span>
          </Link>
          <Link to="/shop" className={`flex flex-col items-center justify-center gap-1 w-full h-full transition-all active:scale-90 ${location.pathname === '/shop' ? 'text-emerald-500 dark:text-emerald-400 font-bold' : 'text-slate-500 dark:text-slate-400 hover:text-emerald-500 dark:hover:text-emerald-400'}`}>
            <AiOutlineShopping size={20} className={location.pathname === '/shop' ? 'scale-110' : ''} />
            <span className="text-[10px] font-medium tracking-tight">Shop</span>
          </Link>
          <Link to="/cart" className={`flex flex-col items-center justify-center gap-1 w-full h-full relative transition-all active:scale-90 ${location.pathname === '/cart' ? 'text-emerald-500 dark:text-emerald-400 font-bold' : 'text-slate-500 dark:text-slate-400 hover:text-emerald-500 dark:hover:text-emerald-400'}`}>
            <div className="relative">
              <AiOutlineShoppingCart size={20} className={location.pathname === '/cart' ? 'scale-110' : ''} />
              {cartItems.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-emerald-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-[9px] font-bold">
                  {cartItems.reduce((a, c) => a + c.qty, 0)}
                </span>
              )}
            </div>
            <span className="text-[10px] font-medium tracking-tight">Cart</span>
          </Link>
          {userInfo && (
             <Link to="/my-orders" className={`flex flex-col items-center justify-center gap-1 w-full h-full transition-all active:scale-90 ${location.pathname === '/my-orders' ? 'text-emerald-500 dark:text-emerald-400 font-bold' : 'text-slate-500 dark:text-slate-400 hover:text-emerald-500 dark:hover:text-emerald-400'}`}>
                <AiOutlineShopping size={20} className={location.pathname === '/my-orders' ? 'scale-110' : ''} />
                <span className="text-[10px] font-medium tracking-tight">Orders</span>
             </Link>
          )}
          {userInfo ? (
            <Link to="/profile" className={`flex flex-col items-center justify-center gap-1 w-full h-full transition-all active:scale-90 ${location.pathname.startsWith('/profile') || location.pathname.startsWith('/admin') ? 'text-emerald-500 dark:text-emerald-400 font-bold' : 'text-slate-500 dark:text-slate-400 hover:text-emerald-500 dark:hover:text-emerald-400'}`}>
              <div className={`relative ${location.pathname.startsWith('/profile') ? 'scale-110' : ''}`}>
                {userInfo.profilePic ? (
                  <img 
                    src={userInfo.profilePic} 
                    alt="Profile" 
                    className={`w-6 h-6 rounded-full object-cover border-2 ${location.pathname.startsWith('/profile') ? 'border-emerald-500' : 'border-transparent'}`} 
                  />
                ) : (
                  <AiOutlineUserAdd size={20} />
                )}
              </div>
              <span className="text-[10px] font-medium tracking-tight">Profile</span>
            </Link>
          ) : (
            <Link to="/login" className={`flex flex-col items-center justify-center gap-1 w-full h-full transition-all active:scale-90 ${location.pathname === '/login' ? 'text-emerald-500 dark:text-emerald-400 font-bold' : 'text-slate-500 dark:text-slate-400 hover:text-emerald-500 dark:hover:text-emerald-400'}`}>
              <AiOutlineLogin size={20} className={location.pathname === '/login' ? 'scale-110' : ''} />
              <span className="text-[10px] font-medium tracking-tight">Login</span>
            </Link>
          )}
        </div>
      </div>
    </>
  );
};

export default Navigation;
