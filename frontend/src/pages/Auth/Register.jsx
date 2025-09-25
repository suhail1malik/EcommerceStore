import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useRegisterMutation } from "../../redux/api/usersApiSlice";
import { setCredentials } from "../../redux/features/auth/authSlice";
import { toast } from "react-toastify";

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
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-slate-900">
      {/* Center card */}
      <div className="w-full max-w-lg mx-auto bg-slate-800 border border-slate-700 rounded-2xl shadow-lg p-10">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-slate-100">
            Create your account
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Join E-Store to discover products, save favorites and checkout
            securely.
          </p>
        </header>

        <form onSubmit={submitHandler} className="space-y-6">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-slate-200"
            >
              Full name
            </label>
            <input
              id="name"
              type="text"
              required
              value={username}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
              className="mt-1 w-full rounded-md border border-slate-600 bg-slate-700 px-3 py-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-slate-200"
            >
              Email address
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="mt-1 w-full rounded-md border border-slate-600 bg-slate-700 px-3 py-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-200"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="mt-1 w-full rounded-md border border-slate-600 bg-slate-700 px-3 py-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-slate-200"
              >
                Confirm password
              </label>
              <input
                id="confirmPassword"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat password"
                className="mt-1 w-full rounded-md border border-slate-600 bg-slate-700 px-3 py-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>
          </div>

          {inlineError && (
            <p className="text-sm text-rose-400">{inlineError}</p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-md bg-pink-600 px-4 py-3 text-white font-medium hover:bg-pink-700 disabled:opacity-50"
          >
            {isLoading ? "Registering..." : "Create account"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-400">
          Already have an account?{" "}
          <Link
            to={redirect ? `/login?redirect=${redirect}` : "/login"}
            className="text-pink-500 hover:underline"
          >
            Log in
          </Link>
        </div>

        <div className="mt-4 text-xs text-slate-500 text-center">
          By creating an account, you agree to our{" "}
          <Link to="/terms" className="underline">
            Terms
          </Link>{" "}
          and{" "}
          <Link to="/privacy" className="underline">
            Privacy Policy
          </Link>
          .
        </div>
      </div>
    </div>
  );
};

export default Register;
