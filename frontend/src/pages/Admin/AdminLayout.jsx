import React, { useState } from "react";
import { NavLink, Outlet, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaHome, FaUsers, FaBoxOpen, FaClipboardList, FaPlus, FaTags, FaBars, FaTimes, FaTachometerAlt } from "react-icons/fa";

const AdminLayout = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Fallback protection just in case AdminRoute didn't catch it
  if (!userInfo || !userInfo.isAdmin) {
    return <Navigate to="/login" replace />;
  }

  const navLinks = [
    { name: "Dashboard", path: "/admin", icon: <FaTachometerAlt />, end: true },
    { name: "Manage Users", path: "/admin/users", icon: <FaUsers /> },
    { name: "Categories", path: "/admin/categories", icon: <FaTags /> },
    { name: "Create Product", path: "/admin/addProducts", icon: <FaPlus /> },
    { name: "All Products", path: "/admin/all-products", icon: <FaBoxOpen /> },
    { name: "Orders", path: "/admin/orders", icon: <FaClipboardList /> },
  ];

  return (
    <div className="flex min-h-[calc(100vh-80px)] bg-gray-50 dark:bg-slate-900 overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:sticky top-0 left-0 h-full w-64 bg-white dark:bg-slate-800 shadow-xl border-r border-gray-200 dark:border-slate-700 z-50 transform transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 overflow-y-auto flex flex-col`}
      >
        <div className="p-6 border-b border-gray-200 dark:border-slate-700 flex justify-between items-center bg-gray-50 dark:bg-slate-900/50">
          <div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-emerald-500 to-emerald-500 bg-clip-text text-transparent">
              Admin Portal
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">v2.0 Dashboard</p>
          </div>
          <button 
            className="md:hidden text-gray-500"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <FaTimes size={20} />
          </button>
        </div>

        <nav className="flex-1 py-6 px-4 space-y-2">
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              end={link.end}
              onClick={() => setIsMobileMenuOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 font-medium ${
                  isActive
                    ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/20"
                    : "text-gray-600 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-slate-700 hover:text-emerald-600 dark:hover:text-emerald-400"
                }`
              }
            >
              <span className="text-lg">{link.icon}</span>
              {link.name}
            </NavLink>
          ))}
        </nav>
        
        <div className="p-4 border-t border-gray-200 dark:border-slate-700 m-4 rounded-xl bg-gray-50 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center text-emerald-500 font-bold">
               {userInfo?.username?.charAt(0)?.toUpperCase()}
             </div>
             <div className="overflow-hidden">
               <p className="text-sm font-semibold text-gray-800 dark:text-slate-200 truncate">{userInfo?.username}</p>
               <p className="text-xs text-gray-500 dark:text-gray-400 truncate">Administrator</p>
             </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col w-full md:w-[calc(100%-16rem)] min-w-0">
        {/* Mobile Header */}
        <div className="md:hidden bg-white dark:bg-slate-800 shadow-sm border-b border-gray-200 dark:border-slate-700 p-4 flex items-center justify-between sticky top-0 z-30">
          <h1 className="font-semibold text-gray-800 dark:text-slate-200">Admin Control</h1>
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 bg-gray-100 dark:bg-slate-700 rounded text-gray-600 dark:text-gray-300"
          >
            <FaBars />
          </button>
        </div>

        {/* Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden">
          <div className="max-w-7xl mx-auto w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
