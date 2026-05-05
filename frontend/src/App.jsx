import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navigation from "./pages/Auth/Navigation";
import Footer from "./components/Footer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  // Scroll to top on route change
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-transparent text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-500">
      {/* Dynamic Aurora Background */}
      <div className="aurora-bg">
        <div className="aurora-sphere bg-emerald-500/20 top-[-10%] left-[-10%]"></div>
        <div className="aurora-sphere bg-blue-500/10 bottom-[-20%] right-[-10%]" style={{ animationDelay: '-5s' }}></div>
      </div>

      <ToastContainer position="top-center" autoClose={3000} />
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
