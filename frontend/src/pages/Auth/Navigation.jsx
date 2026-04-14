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
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { BsMoon, BsSun } from "react-icons/bs";
import { useTheme } from "../../components/ThemeProvider";
import { useLogoutMutation } from "../../redux/api/usersApiSlice";
import { logout } from "../../redux/features/auth/authSlice";
import FavoritesCount from "../Products/FavoritesCount";
import { MdLocationOn } from "react-icons/md";

const Navigation = () => {
  const { theme, toggleTheme } = useTheme();
  const { userInfo } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [locationLabel, setLocationLabel] = useState("Your area");
  const [locating, setLocating] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [logoutApiCall] = useLogoutMutation();

  const dropdownRef = useRef(null);
  const mobileRef = useRef(null);
  const toggleBtnRef = useRef(null);

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

  // Detect and cache user location
  useEffect(() => {
    const saved = localStorage.getItem("userLocationLabel");
    if (saved) {
      setLocationLabel(saved);
      return;
    }
    if (!("geolocation" in navigator)) return;

    let cancelled = false;
    setLocating(true);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        if (cancelled) return;
        try {
          const { latitude, longitude } = pos.coords;
          const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`;
          const res = await fetch(url, {
            headers: { Accept: "application/json" },
          });
          const data = await res.json();
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
        } catch (err) {
          console.log("error in location", err);
        } finally {
          if (!cancelled) setLocating(false);
        }
      },
      () => {
        if (!cancelled) setLocating(false);
      },
      { timeout: 6000 }
    );

    return () => {
      cancelled = true;
    };
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
    if (q) navigate(`/shop?search=${encodeURIComponent(q)}`);
    else navigate("/shop");
    setMobileOpen(false);
  };

  const clearLocation = () => {
    localStorage.removeItem("userLocationLabel");
    setLocationLabel("Your area");
    setLocating(true);
    if (!("geolocation" in navigator)) {
      setLocating(false);
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
      () => setLocating(false),
      { timeout: 6000 }
    );
  };

  return (
    <>
      <nav className="sticky top-0 z-[100] w-full bg-white/85 dark:bg-zinc-950/85 backdrop-blur-xl border-b border-slate-200 dark:border-white/10 shadow-[0_15px_40px_-10px_rgba(15,23,42,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.6)] transition-all duration-300">
      <div className="max-w-[1400px] mx-auto px-3 sm:px-4 lg:px-6 h-14 flex items-center gap-3">
        {/* Left: brand + badges */}
        <div className="flex items-center gap-4 text-slate-800 dark:text-white shrink-0">
          <Link
            to="/"
            className="font-semibold text-2xl tracking-tight text-slate-900 dark:text-white hover:text-emerald-500 dark:hover:text-emerald-400 transition"
          >
            E-Store
          </Link>

          <button
            title="Detect location"
            onClick={clearLocation}
            aria-label="Detect location"
            className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-md bg-slate-200 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 text-sm hover:bg-slate-300 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white transition"
          >
            <MdLocationOn className="text-emerald-600 dark:text-emerald-500 text-lg" />
            {locating ? "Detecting..." : locationLabel}
          </button>

          <div className="hidden md:flex items-center gap-5">
            <Link
              to="/"
              className={`flex items-center gap-2 transition-colors ${location.pathname === '/' ? 'text-emerald-500 font-semibold' : 'hover:text-emerald-400'}`}
              aria-label="Go to Home"
            >
              <AiOutlineHome className="text-xl" />
              <span className="hidden sm:inline font-medium">Home</span>
            </Link>

            <Link
              to="/shop"
              className={`flex items-center gap-2 transition-colors ${location.pathname === '/shop' ? 'text-emerald-500 font-semibold' : 'hover:text-emerald-400'}`}
              aria-label="Browse Shop"
            >
              <AiOutlineShopping className="text-xl" />
              <span className="hidden sm:inline font-medium">Shop</span>
            </Link>

            {userInfo && !userInfo.isAdmin && (
              <Link
                to="/user-orders"
                className={`flex items-center gap-2 transition-colors ${location.pathname === '/user-orders' ? 'text-emerald-500 font-semibold' : 'hover:text-emerald-400'}`}
                aria-label="My Orders"
              >
                <AiOutlineShopping className="text-xl" />
                <span className="hidden sm:inline font-medium">Orders</span>
              </Link>
            )}

            <Link
              to="/favorite"
              className={`flex items-center gap-2 transition-colors ${location.pathname === '/favorite' ? 'text-emerald-500 font-semibold' : 'hover:text-emerald-400'}`}
              aria-label="Favorites"
            >
              <span className="relative inline-block">
                <FaHeart className="text-xl" />
                <FavoritesCount />
              </span>
              <span className="hidden sm:inline font-medium">Favorites</span>
            </Link>
          </div>
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
                <span className="hidden sm:inline">{userInfo.username}</span>
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
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search for brands and products"
              className="w-full pl-11 pr-4 py-2.5 bg-slate-100/90 dark:bg-slate-800/60 backdrop-blur-sm border border-transparent focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-900 rounded-full text-[15px] text-slate-900 dark:text-gray-100 placeholder:text-slate-500 dark:placeholder:text-gray-400 outline-none transition-all shadow-inner"
            />
          </div>
          <button 
            type="submit" 
            className="w-10 h-10 shrink-0 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full flex items-center justify-center shadow-md transition-colors"
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
          <Link to="/" className={`flex flex-col items-center justify-center gap-1 w-full h-full transition-colors ${location.pathname === '/' ? 'text-emerald-500 dark:text-emerald-400 font-bold scale-105' : 'text-slate-500 dark:text-slate-400 hover:text-emerald-500 dark:hover:text-emerald-400'}`}>
            <AiOutlineHome size={20} />
            <span className="text-[10px] font-medium">Home</span>
          </Link>
          <Link to="/shop" className={`flex flex-col items-center justify-center gap-1 w-full h-full transition-colors ${location.pathname === '/shop' ? 'text-emerald-500 dark:text-emerald-400 font-bold scale-105' : 'text-slate-500 dark:text-slate-400 hover:text-emerald-500 dark:hover:text-emerald-400'}`}>
            <AiOutlineSearch size={20} />
            <span className="text-[10px] font-medium">Shop</span>
          </Link>
          <Link to="/cart" className={`flex flex-col items-center justify-center gap-1 w-full h-full relative transition-colors ${location.pathname === '/cart' ? 'text-emerald-500 dark:text-emerald-400 font-bold scale-105' : 'text-slate-500 dark:text-slate-400 hover:text-emerald-500 dark:hover:text-emerald-400'}`}>
            <div className="relative">
              <AiOutlineShoppingCart size={20} />
              {cartItems.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-emerald-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-[9px] font-bold">
                  {cartItems.reduce((a, c) => a + c.qty, 0)}
                </span>
              )}
            </div>
            <span className="text-[10px] font-medium">Cart</span>
          </Link>
          {userInfo && !userInfo.isAdmin && (
             <Link to="/user-orders" className={`flex flex-col items-center justify-center gap-1 w-full h-full transition-colors ${location.pathname === '/user-orders' ? 'text-emerald-500 dark:text-emerald-400 font-bold scale-105' : 'text-slate-500 dark:text-slate-400 hover:text-emerald-500 dark:hover:text-emerald-400'}`}>
                <AiOutlineShopping size={20} />
                <span className="text-[10px] font-medium">Orders</span>
             </Link>
          )}
          {userInfo ? (
            <Link to="/profile" className={`flex flex-col items-center justify-center gap-1 w-full h-full transition-colors ${location.pathname.startsWith('/profile') || location.pathname.startsWith('/admin') ? 'text-emerald-500 dark:text-emerald-400 font-bold scale-105' : 'text-slate-500 dark:text-slate-400 hover:text-emerald-500 dark:hover:text-emerald-400'}`}>
              <AiOutlineUserAdd size={20} />
              <span className="text-[10px] font-medium">Profile</span>
            </Link>
          ) : (
            <Link to="/login" className={`flex flex-col items-center justify-center gap-1 w-full h-full transition-colors ${location.pathname === '/login' ? 'text-emerald-500 dark:text-emerald-400 font-bold scale-105' : 'text-slate-500 dark:text-slate-400 hover:text-emerald-500 dark:hover:text-emerald-400'}`}>
              <AiOutlineLogin size={20} />
              <span className="text-[10px] font-medium">Login</span>
            </Link>
          )}
        </div>
      </div>
    </>
  );
};

export default Navigation;
