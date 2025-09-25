import React from "react";
import { Outlet } from "react-router-dom";
import Navigation from "./pages/Auth/Navigation";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100">
      <ToastContainer />
      <Navigation />
      {/* MAIN CONTENT */}
      <main className="pt-6 sm:pt-8 w-full px-2 sm:px-4 lg:px-6">
        <Outlet />
      </main>
    </div>
  );
}

export default App;
