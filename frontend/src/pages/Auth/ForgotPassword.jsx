import { useState } from "react";
import { Link } from "react-router-dom";
import { useForgotPasswordMutation } from "../../redux/api/usersApiSlice";
import { toast } from "react-toastify";
import Loader from "../../components/Loader";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please provide email address");
      return;
    }
    
    try {
      const res = await forgotPassword({ email }).unwrap();
      toast.success(res.message || "Reset link sent to your email!");
      setEmail("");
    } catch (err) {
      toast.error(err?.data?.message || err.error || "Failed to send reset email");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center -mt-10 px-4 sm:px-0">
      <div className="w-full max-w-md p-8 space-y-8 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700">
        <div>
          <h1 className="text-center text-3xl font-extrabold text-slate-900 dark:text-slate-100" style={{ fontFamily: "'Playfair Display', serif" }}>
            Forgot Password
          </h1>
          <p className="mt-2 text-center text-sm text-slate-600 dark:text-slate-400">
            Enter your email to receive a recovery link.
          </p>
        </div>

        <form onSubmit={submitHandler} className="mt-8 space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Email Address
            </label>
            <div className="mt-1">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none block w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm bg-transparent dark:text-white"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              disabled={isLoading}
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all disabled:opacity-50"
            >
              {isLoading ? "Sending..." : "Send Reset Link"}
            </button>
          </div>
          {isLoading && <Loader />}
        </form>

        <div className="text-center mt-4">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Remembered your password?{" "}
            <Link to="/login" className="font-bold text-emerald-600 hover:text-emerald-500">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
