import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useRegisterMutation } from "../../redux/api/usersApiSlice";
import { setCredentials } from "../../redux/features/auth/authSlice";
import { toast } from "react-toastify";

import { motion } from "framer-motion";

const Register = () => {
  const [username, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [inlineError, setInlineError] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [register, { isLoading }] = useRegisterMutation();
  const { userInfo } = useSelector((state) => state.auth);

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get("redirect") || "/";

  useEffect(() => {
    if (userInfo) navigate(redirect);
  }, [navigate, redirect, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    setInlineError("");

    if (password !== confirmPassword) {
      setInlineError("Passwords do not match");
      return;
    }
    if (password.length < 6) {
      setInlineError("Password must be at least 6 characters");
      return;
    }

    try {
      const res = await register({ username, email, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      toast.success("Registered successfully");
      navigate(redirect);
    } catch (err) {
      toast.error(err?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center px-4 py-12 overflow-hidden bg-[#020617]">
      {/* Background Aurora Effect */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-emerald-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '12s' }} />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-teal-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '18s' }} />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-xl z-10"
      >
        <div className="premium-card rounded-[32px] p-8 sm:p-12 shadow-2xl relative overflow-hidden group">
          <header className="mb-10 text-center relative z-10">
            <div className="inline-block p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 mb-4">
               <svg className="w-8 h-8 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
               </svg>
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight mb-2 italic font-serif" style={{ fontFamily: "'Playfair Display', serif" }}>
              Join the Hub
            </h1>
            <p className="text-slate-400 text-sm font-medium max-w-xs mx-auto">
              Create your profile to unlock premium marketplace access.
            </p>
          </header>

          <form onSubmit={submitHandler} className="space-y-6 relative z-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-2 ml-1"
                >
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Full Name"
                  className="w-full px-5 py-3.5 border-2 border-slate-700/50 rounded-xl bg-slate-900/50 text-white font-semibold focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all placeholder:text-slate-600"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-2 ml-1"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@protocol.com"
                  className="w-full px-5 py-3.5 border-2 border-slate-700/50 rounded-xl bg-slate-900/50 text-white font-semibold focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all placeholder:text-slate-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="password"
                  className="block text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-2 ml-1"
                >
                  Account Password
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="6+ characters"
                  className="w-full px-5 py-3.5 border-2 border-slate-700/50 rounded-xl bg-slate-900/50 text-white font-semibold focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all placeholder:text-slate-600"
                />
              </div>
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-2 ml-1"
                >
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat Sequence"
                  className="w-full px-5 py-3.5 border-2 border-slate-700/50 rounded-xl bg-slate-900/50 text-white font-semibold focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all placeholder:text-slate-600"
                />
              </div>
            </div>

            {inlineError && (
              <p className="text-xs font-bold text-rose-500 bg-rose-500/10 p-3 rounded-lg border border-rose-500/20">{inlineError}</p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full relative group/btn overflow-hidden rounded-xl bg-emerald-600 py-4 text-white font-bold uppercase tracking-widest text-sm shadow-xl shadow-emerald-600/20 hover:bg-emerald-500 transition-all active:scale-95 disabled:opacity-50"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-transparent translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-1000" />
              {isLoading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <div className="mt-10 text-center text-xs font-bold uppercase tracking-widest text-slate-500 border-t border-slate-800 pt-8 relative z-10">
            Already registered?{" "}
            <Link
              to={redirect ? `/login?redirect=${redirect}` : "/login"}
              className="text-emerald-500 hover:text-emerald-400 transition-colors ml-1"
            >
              Sign In &rarr;
            </Link>
          </div>

          <div className="mt-6 text-[10px] font-bold text-slate-600 text-center relative z-10">
            By joining, you accept our{" "}
            <Link to="/terms" className="text-slate-400 hover:text-emerald-500 underline decoration-slate-700">Terms</Link>
            {" "}and{" "}
            <Link to="/privacy" className="text-slate-400 hover:text-emerald-500 underline decoration-slate-700">Privacy Policy</Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
