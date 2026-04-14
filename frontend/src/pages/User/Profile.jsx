// src/pages/profile/Profile.jsx
import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Link, useLocation, useNavigate } from "react-router-dom";

import Loader from "../../components/Loader";
import { useProfileMutation } from "../../redux/api/usersApiSlice";
import { setCredentials } from "../../redux/features/auth/authSlice";
import MyOrders from "./MyOrders";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Small helpers (could be extracted to utils)
 */
const isValidEmail = (email) =>
  !!email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const passwordStrength = (pwd) => {
  if (!pwd) return { score: 0, label: "Empty" };
  let score = 0;
  if (pwd.length >= 8) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  const labels = ["Very weak", "Weak", "Okay", "Strong", "Very strong"];
  return { score, label: labels[score] || "Very weak" };
};

const Profile = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { userInfo } = useSelector((state) => state.auth || {});

  // Determine initial tab from location hash or default to profile
  const initialTab = location.hash === "#orders" ? "orders" : "profile";
  const [activeTab, setActiveTab] = useState(initialTab);

  // local form state with safe defaults
  const [username, setUserName] = useState(userInfo?.username || "");
  const [email, setEmail] = useState(userInfo?.email || "");
  const [phone, setPhone] = useState(userInfo?.phone || "");
  const [profilePic, setProfilePic] = useState(userInfo?.profilePic || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);

  // inline validation errors
  const [errors, setErrors] = useState({});

  const [updateProfile, { isLoading: loadingUpdateProfile }] =
    useProfileMutation();

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("image", file);

    try {
      setUploadingImage(true);
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || "Failed to upload image");
      }
      
      setProfilePic(data.imageUrl);
      toast.success(data.message || "Image uploaded successfully");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setUploadingImage(false);
    }
  };

  // keep local state in sync if userInfo changes (guarded)
  useEffect(() => {
    if (userInfo) {
      setUserName(userInfo.username || "");
      setEmail(userInfo.email || "");
      setPhone(userInfo.phone || "");
      setProfilePic(userInfo.profilePic || "");
    }
  }, [userInfo]);

  // Derived values
  const pwdStrength = useMemo(() => passwordStrength(password), [password]);

  // Validate function returns boolean and sets `errors`
  const validate = useCallback(() => {
    const e = {};
    if (!username || username.trim().length < 2) {
      e.username = "Name must be at least 2 characters.";
    }
    if (!isValidEmail(email)) {
      e.email = "Enter a valid email address.";
    }
    if (password || confirmPassword) {
      // if either password field filled, validate them both
      if (password.length < 6)
        e.password = "Password must be at least 6 characters.";
      if (password !== confirmPassword)
        e.confirmPassword = "Passwords do not match.";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }, [username, email, password, confirmPassword]);

  const submitHandler = useCallback(
    async (e) => {
      e.preventDefault();
      if (!validate()) {
        return toast.error("Please fix the form errors and try again.");
      }

      try {
        const updated = await updateProfile({
          _id: userInfo?._id,
          username: username.trim(),
          email: email.trim(),
          phone: phone.trim(),
          profilePic: profilePic.trim(),
          password: password || undefined,
        }).unwrap();

        dispatch(setCredentials({ ...updated }));
        toast.success("Profile updated successfully");
        setPassword("");
        setConfirmPassword("");
        setErrors({});
      } catch (err) {
        const msg = err?.data?.message || err?.message || "Update failed";
        toast.error(msg);
        if (err?.data?.errors) {
          setErrors((prev) => ({ ...prev, ...err.data.errors }));
        }
        console.error("updateProfile error:", err);
      }
    },
    [dispatch, updateProfile, userInfo?._id, username, email, phone, profilePic, password, validate]
  );

  if (!userInfo) {
    return (
      <div className="container mx-auto p-6">
        <p className="text-center text-gray-700 dark:text-slate-300">
          You must be logged in to view this page.
        </p>
        <div className="text-center mt-4">
          <Link to="/login" className="text-emerald-600 dark:text-emerald-300">
            Go to login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <div className="w-full md:w-1/4 bg-white dark:bg-slate-800 shadow-md rounded-lg p-4 h-max">
          <div className="flex items-center gap-3 mb-6 px-4">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-emerald-100 flex items-center justify-center text-emerald-500 font-bold border border-emerald-200 object-cover">
              {profilePic ? (
                <img src={profilePic} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                userInfo.username?.[0]?.toUpperCase() || "U"
              )}
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-slate-400">Hello,</p>
              <p className="font-semibold text-gray-900 dark:text-slate-100 truncate">{userInfo.username}</p>
            </div>
          </div>
          
          <ul className="space-y-2 mt-2">
            <li>
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full text-left px-5 py-3.5 rounded-xl transition-all duration-300 ${
                  activeTab === 'profile' 
                    ? 'bg-emerald-500 font-bold text-white shadow-md shadow-emerald-500/20 translate-x-1' 
                    : 'text-gray-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:translate-x-1 font-medium bg-transparent'
                }`}
              >
                <div className="flex flex-row items-center gap-3">
                  <span className="text-xl">👤</span>
                  Personal Information
                </div>
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab('orders')}
                className={`w-full text-left px-5 py-3.5 rounded-xl transition-all duration-300 ${
                  activeTab === 'orders' 
                    ? 'bg-emerald-500 font-bold text-white shadow-md shadow-emerald-500/20 translate-x-1' 
                    : 'text-gray-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:translate-x-1 font-medium bg-transparent'
                }`}
              >
                <div className="flex flex-row items-center gap-3">
                  <span className="text-xl">📦</span>
                  My Orders
                </div>
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab('addresses')}
                className={`w-full text-left px-5 py-3.5 rounded-xl transition-all duration-300 ${
                  activeTab === 'addresses' 
                    ? 'bg-emerald-500 font-bold text-white shadow-md shadow-emerald-500/20 translate-x-1' 
                    : 'text-gray-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:translate-x-1 font-medium bg-transparent'
                }`}
              >
                <div className="flex flex-row items-center gap-3">
                  <span className="text-xl">📍</span>
                  Manage Addresses
                </div>
              </button>
            </li>
          </ul>
        </div>
        
        {/* Main Content Area */}
        <div className="w-full md:w-3/4 min-h-[500px]">
          <AnimatePresence mode="wait">
            {activeTab === 'profile' && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="bg-white dark:bg-slate-800 shadow-xl rounded-[24px] p-8 border border-slate-100 dark:border-slate-700/50"
              >
                <h2 className="text-2xl font-bold text-gray-900 dark:text-slate-100 mb-6 pb-4 border-b border-gray-100 dark:border-slate-700">
                  Personal Information
                </h2>

                <form onSubmit={submitHandler} noValidate>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Name */}
                    <div className="mb-4">
                      <label htmlFor="name" className="block text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-slate-400 mb-2">
                        Display Name
                      </label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        value={username}
                        onChange={(e) => setUserName(e.target.value)}
                        className="w-full px-4 py-3 border-2 border-slate-200 dark:border-slate-600 rounded-xl bg-slate-50 dark:bg-slate-700 text-gray-900 dark:text-slate-100 font-semibold focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                        aria-invalid={!!errors.username}
                      />
                      {errors.username && <p className="mt-2 text-sm text-red-600 font-medium">{errors.username}</p>}
                    </div>

                    {/* Email */}
                    <div className="mb-4">
                      <label htmlFor="email" className="block text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-slate-400 mb-2">
                        Email Address
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 border-2 border-slate-200 dark:border-slate-600 rounded-xl bg-slate-50 dark:bg-slate-700 text-gray-900 dark:text-slate-100 font-semibold focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                        aria-invalid={!!errors.email}
                      />
                      {errors.email && <p className="mt-2 text-sm text-red-600 font-medium">{errors.email}</p>}
                    </div>
                    
                    {/* Phone Number */}
                    <div className="mb-4">
                      <label htmlFor="phone" className="block text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-slate-400 mb-2">
                        Phone Number
                      </label>
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-4 py-3 border-2 border-slate-200 dark:border-slate-600 rounded-xl bg-slate-50 dark:bg-slate-700 text-gray-900 dark:text-slate-100 font-semibold focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                        placeholder="+91..."
                      />
                    </div>

                    {/* Profile Pic Upload */}
                    <div className="mb-4">
                      <label htmlFor="profilePic" className="block text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-slate-400 mb-2">
                        Profile Picture
                      </label>
                      <div className="flex items-center gap-4">
                        <input
                          id="profilePic"
                          name="profilePic"
                          type="file"
                          accept="image/*"
                          onChange={uploadFileHandler}
                          className="block w-full text-sm text-gray-500 dark:text-gray-400
                            file:mr-4 file:py-2.5 file:px-4
                            file:rounded-lg file:border-0
                            file:text-xs file:font-bold file:uppercase file:tracking-widest
                            file:bg-emerald-100 file:text-emerald-600
                            dark:file:bg-emerald-900/30 dark:file:text-emerald-400
                            hover:file:bg-emerald-200 dark:hover:file:bg-emerald-900/50 transition-all cursor-pointer"
                        />
                        {uploadingImage && <Loader />}
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 mb-4 pt-8 border-t border-gray-100 dark:border-slate-700">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-slate-100 mb-6">Security Context</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Password */}
                      <div className="mb-4">
                        <label htmlFor="password" className="block text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-slate-400 mb-2">
                          New Password
                        </label>
                        <input
                          id="password"
                          name="password"
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full px-4 py-3 border-2 border-slate-200 dark:border-slate-600 rounded-xl bg-slate-50 dark:bg-slate-700 text-gray-900 dark:text-slate-100 font-semibold focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                          placeholder="Leave blank to keep current"
                        />
                        <div className="mt-3 flex items-center justify-between text-xs font-bold uppercase tracking-widest">
                          <div className="text-gray-400 dark:text-slate-500">
                            Strength: <span className="text-emerald-500">{pwdStrength.label}</span>
                          </div>
                          <div className="w-24 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden ml-2">
                            <div
                              style={{ width: `${(pwdStrength.score / 4) * 100}%` }}
                              className={`h-full ${pwdStrength.score >= 3 ? "bg-green-500" : "bg-emerald-500"}`}
                            />
                          </div>
                        </div>
                        {errors.password && <p className="mt-2 text-sm text-red-600 font-medium">{errors.password}</p>}
                      </div>

                      {/* Confirm Password */}
                      <div className="mb-4">
                        <label htmlFor="confirmPassword" className="block text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-slate-400 mb-2">
                          Confirm Iteration
                        </label>
                        <input
                          id="confirmPassword"
                          name="confirmPassword"
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="w-full px-4 py-3 border-2 border-slate-200 dark:border-slate-600 rounded-xl bg-slate-50 dark:bg-slate-700 text-gray-900 dark:text-slate-100 font-semibold focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                        />
                        {errors.confirmPassword && <p className="mt-2 text-sm text-red-600 font-medium">{errors.confirmPassword}</p>}
                      </div>
                    </div>
                  </div>

                  <div className="flex pt-6">
                    <button
                      type="submit"
                      disabled={loadingUpdateProfile}
                      className={`px-8 py-3.5 rounded-xl bg-emerald-600 text-white text-sm uppercase tracking-widest font-bold hover:bg-emerald-700 disabled:opacity-50 transition-all shadow-lg shadow-emerald-600/20 active:scale-95 flex items-center gap-3 ${
                        loadingUpdateProfile ? "cursor-wait" : ""
                      }`}
                    >
                      {loadingUpdateProfile ? <Loader /> : "Commit Changes"}
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {activeTab === 'orders' && (
              <motion.div
                key="orders"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <MyOrders />
              </motion.div>
            )}

            {activeTab === 'addresses' && (
              <motion.div
                key="addresses"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="bg-white dark:bg-slate-800 shadow-xl rounded-[24px] p-8 border border-slate-100 dark:border-slate-700/50"
              >
                <h2 className="text-2xl font-bold text-gray-900 dark:text-slate-100 mb-6 pb-4 border-b border-gray-100 dark:border-slate-700">
                  Residency Nodes
                </h2>
                <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-12 text-center border-2 border-dashed border-slate-200 dark:border-slate-700">
                  <span className="text-5xl mb-4 block opacity-50">📍</span>
                  <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">Uncharted Territory</h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-8 font-medium">Add your home or office address to experience faster checkout speeds.</p>
                  <button className="px-8 py-3.5 bg-gray-900 dark:bg-emerald-600 text-white rounded-xl text-sm font-bold uppercase tracking-widest transition-all cursor-not-allowed opacity-50">
                    + Register Address
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Profile;
