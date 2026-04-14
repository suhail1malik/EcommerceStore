import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navigation from "./pages/Auth/Navigation";
import Footer from "./components/Footer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen bg-transparent text-slate-900 dark:text-slate-100 flex flex-col">
      <ToastContainer />
      <Navigation />
      {/* MAIN CONTENT */}
      <main className={`flex-1 w-full ${isAdminRoute ? '' : 'pt-6 sm:pt-8 px-2 sm:px-4 lg:px-6'}`}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default App;
