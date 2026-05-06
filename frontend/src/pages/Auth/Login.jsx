import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useLoginMutation } from "../../redux/api/usersApiSlice";
import { setCredentials } from "../../redux/features/auth/authSlice";
import { toast } from "react-toastify";
import Loader from "../../components/Loader";
import { motion } from "framer-motion";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [login, { isLoading }] = useLoginMutation();
  const { userInfo } = useSelector((state) => state.auth);

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get("redirect") || "/";

  useEffect(() => {
    if (userInfo) navigate(redirect);
  }, [navigate, redirect, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate(redirect);
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center px-4 overflow-hidden bg-[#020617]">
      {/* Background Aurora Effect */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-emerald-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '10s' }} />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-teal-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '15s' }} />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md z-10"
      >
        <div className="premium-card rounded-[32px] p-8 sm:p-12 shadow-2xl relative overflow-hidden group">
          <header className="mb-10 text-center relative z-10">
            <div className="inline-block p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 mb-4">
               <svg className="w-8 h-8 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 00-2 2zm10-10V7a4 4 0 00-8 0v4h8z" />
               </svg>
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight mb-2 italic font-serif" style={{ fontFamily: "'Playfair Display', serif" }}>
              Welcome back
            </h1>
            <p className="text-slate-400 text-sm font-medium">
              Sign in to access your curated collection.
            </p>
          </header>

          <form onSubmit={submitHandler} className="space-y-6 relative z-10">
            <div>
              <label
                htmlFor="email"
                className="block text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-2 ml-1"
              >
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@protocol.com"
                  className="w-full px-5 py-4 border-2 border-slate-700/50 rounded-xl bg-slate-900/50 text-white font-semibold focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all placeholder:text-slate-600"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2 ml-1">
                <label
                  htmlFor="password"
                  className="block text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500"
                >
                  Security Password
                </label>
                <Link to="/forgot-password" className="text-[10px] font-bold uppercase tracking-widest text-emerald-500 hover:text-emerald-400 transition-colors">
                  Forgot Password?
                </Link>
              </div>
              <input
                type="password"
                id="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-5 py-4 border-2 border-slate-700/50 rounded-xl bg-slate-900/50 text-white font-semibold focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all placeholder:text-slate-600"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full relative group/btn overflow-hidden rounded-xl bg-emerald-600 py-4 text-white font-bold uppercase tracking-widest text-sm shadow-xl shadow-emerald-600/20 hover:bg-emerald-500 transition-all active:scale-95 disabled:opacity-50"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-transparent translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-1000" />
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                   <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                   Authenticating...
                </div>
              ) : "Sign in to Account"}
            </button>
          </form>

          <div className="mt-10 text-center text-xs font-bold uppercase tracking-widest text-slate-500 border-t border-slate-800 pt-8 relative z-10">
            New to CommerceHub?{" "}
            <Link
              to={redirect ? `/register?redirect=${redirect}` : "/register"}
              className="text-emerald-500 hover:text-emerald-400 transition-colors ml-1"
            >
              Create Account &rarr;
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
