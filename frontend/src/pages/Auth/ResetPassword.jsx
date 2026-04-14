import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useResetPasswordMutation } from "../../redux/api/usersApiSlice";
import { toast } from "react-toastify";
import Loader from "../../components/Loader";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const { token } = useParams();
  const navigate = useNavigate();

  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    
    try {
      const res = await resetPassword({ token, password }).unwrap();
      toast.success(res.message || "Password reset successfully");
      navigate("/login");
    } catch (err) {
      toast.error(err?.data?.message || err.error || "Reset failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center -mt-10 px-4 sm:px-0">
      <div className="w-full max-w-md p-8 space-y-8 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700">
        <div>
          <h1 className="text-center text-3xl font-extrabold text-slate-900 dark:text-slate-100" style={{ fontFamily: "'Playfair Display', serif" }}>
            Secure Reset
          </h1>
          <p className="mt-2 text-center text-sm text-slate-600 dark:text-slate-400">
            Enter your new password below.
          </p>
        </div>

        <form onSubmit={submitHandler} className="mt-8 space-y-6">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              New Password
            </label>
            <div className="mt-1">
              <input
                id="password"
                type="password"
                required
                className="appearance-none block w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm bg-transparent dark:text-white"
                placeholder="Securely type it here"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Confirm New Password
            </label>
            <div className="mt-1">
              <input
                id="confirmPassword"
                type="password"
                required
                className="appearance-none block w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm bg-transparent dark:text-white"
                placeholder="Type it again to confirm"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              disabled={isLoading}
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all disabled:opacity-50"
            >
              {isLoading ? "Processing..." : "Confirm Password Change"}
            </button>
          </div>
          {isLoading && <Loader />}
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
