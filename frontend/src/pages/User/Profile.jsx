// src/pages/profile/Profile.jsx
import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

import Loader from "../../components/Loader";
import { useProfileMutation } from "../../redux/api/usersApiSlice";
import { setCredentials } from "../../redux/features/auth/authSlice";

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
  const { userInfo } = useSelector((state) => state.auth || {});

  // local form state with safe defaults
  const [username, setUserName] = useState(userInfo?.username || "");
  const [email, setEmail] = useState(userInfo?.email || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // inline validation errors
  const [errors, setErrors] = useState({});

  const [updateProfile, { isLoading: loadingUpdateProfile }] =
    useProfileMutation();

  // keep local state in sync if userInfo changes (guarded)
  useEffect(() => {
    if (userInfo) {
      setUserName(userInfo.username || "");
      setEmail(userInfo.email || "");
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
        // call RTK Query mutation and unwrap for proper catch
        const updated = await updateProfile({
          _id: userInfo?._id,
          username: username.trim(),
          email: email.trim(),
          password: password || undefined, // don't send empty string if unchanged
        }).unwrap();

        // update auth slice with new credentials
        dispatch(setCredentials({ ...updated }));
        toast.success("Profile updated successfully");
        // clear password fields after success
        setPassword("");
        setConfirmPassword("");
        setErrors({});
      } catch (err) {
        // err may be serialized - use safe message
        const msg = err?.data?.message || err?.message || "Update failed";
        toast.error(msg);
        // optional: set server-side field errors if exists (example)
        if (err?.data?.errors) {
          setErrors((prev) => ({ ...prev, ...err.data.errors }));
        }
        console.error("updateProfile error:", err);
      }
    },
    [
      dispatch,
      updateProfile,
      userInfo?._id,
      username,
      email,
      password,
      validate,
    ]
  );

  // Quick guard if userInfo not available (redirect would be better)
  if (!userInfo) {
    return (
      <div className="container mx-auto p-6">
        <p className="text-center text-gray-700 dark:text-slate-300">
          You must be logged in to view this page.
        </p>
        <div className="text-center mt-4">
          <Link to="/login" className="text-indigo-600 dark:text-indigo-300">
            Go to login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto bg-white dark:bg-slate-800 shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-slate-100 mb-4">
          Update Profile
        </h2>

        <form onSubmit={submitHandler} noValidate>
          {/* Name */}
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1"
            >
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={username}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full px-3 py-2 border rounded bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 border-slate-300 dark:border-slate-600"
              placeholder="Your name"
              autoComplete="name"
              aria-invalid={!!errors.username}
              aria-describedby={errors.username ? "name-error" : undefined}
            />
            {errors.username && (
              <p
                id="name-error"
                className="mt-1 text-sm text-red-600"
                role="alert"
              >
                {errors.username}
              </p>
            )}
          </div>

          {/* Email */}
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 border-slate-300 dark:border-slate-600"
              placeholder="you@example.com"
              autoComplete="email"
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "email-error" : undefined}
            />
            {errors.email && (
              <p
                id="email-error"
                className="mt-1 text-sm text-red-600"
                role="alert"
              >
                {errors.email}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1"
            >
              Password (leave blank to keep current)
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 border-slate-300 dark:border-slate-600"
              placeholder="New password"
              autoComplete="new-password"
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? "password-error" : undefined}
            />
            <div className="mt-2 flex items-center justify-between text-sm">
              <div className="text-gray-600 dark:text-slate-300">
                Strength:{" "}
                <span className="font-medium">{pwdStrength.label}</span>
              </div>
              <div className="w-24 h-2 bg-slate-200 dark:bg-slate-700 rounded overflow-hidden ml-2">
                <div
                  style={{ width: `${(pwdStrength.score / 4) * 100}%` }}
                  className={`h-full ${
                    pwdStrength.score >= 3 ? "bg-green-500" : "bg-yellow-500"
                  }`}
                />
              </div>
            </div>
            {errors.password && (
              <p
                id="password-error"
                className="mt-1 text-sm text-red-600"
                role="alert"
              >
                {errors.password}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="mb-6">
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1"
            >
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 border-slate-300 dark:border-slate-600"
              placeholder="Confirm new password"
              autoComplete="new-password"
              aria-invalid={!!errors.confirmPassword}
              aria-describedby={
                errors.confirmPassword ? "confirmPassword-error" : undefined
              }
            />
            {errors.confirmPassword && (
              <p
                id="confirmPassword-error"
                className="mt-1 text-sm text-red-600"
                role="alert"
              >
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between gap-4">
            <button
              type="submit"
              disabled={loadingUpdateProfile}
              aria-busy={loadingUpdateProfile}
              className={`inline-flex items-center px-4 py-2 rounded bg-pink-500 text-white font-medium hover:bg-pink-600 disabled:opacity-60 ${
                loadingUpdateProfile ? "cursor-wait" : ""
              }`}
            >
              {loadingUpdateProfile ? <Loader /> : "Update"}
            </button>

            <Link
              to="/user-orders"
              className="inline-block px-4 py-2 rounded border border-slate-300 dark:border-slate-600 text-sm text-gray-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700"
            >
              My Orders
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
