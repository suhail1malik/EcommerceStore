// src/pages/admin/AdminDashboard.jsx
import { useMemo, useState } from "react";
import Chart from "react-apexcharts";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaChartBar, FaChartPie, FaChartLine, FaUsers, FaShoppingCart, FaDollarSign } from "react-icons/fa";

import { useGetUsersQuery } from "../../redux/api/usersApiSlice";
import {
  useGetTotalOrdersQuery,
  useGetTotalSalesByDateQuery,
  useGetTotalSalesQuery,
} from "../../redux/api/orderApiSlice";

import OrderList from "./OrderList";
import Loader from "../../components/Loader";
import { useGetProductsQuery } from "../../redux/api/productApiSlice";
import { FaUserCircle, FaExclamationTriangle, FaRss, FaMicrochip } from "react-icons/fa";
import { useEffect } from "react";

const AdminDashboard = () => {
  const [chartType, setChartType] = useState("bar"); // bar, pie, line
  const [activities, setActivities] = useState([
    { id: 1, type: 'order', msg: 'New order processed successfully', time: 'Just now' },
    { id: 2, type: 'user', msg: 'New customer registration completed', time: '2m ago' },
    { id: 3, type: 'stock', msg: 'Stock alert: High demand item reaching critical level', time: '5m ago' },
  ]);

  const { data: sales, isLoading: loadingSales } = useGetTotalSalesQuery();
  const { data: customers, isLoading: loadingCustomers } = useGetUsersQuery();
  const { data: orders, isLoading: loadingOrders } = useGetTotalOrdersQuery();
  const { data: salesDetail } = useGetTotalSalesByDateQuery();
  const { data: productData } = useGetProductsQuery({});

  const totalSalesValue = sales?.totalSales ?? 0;
  const customersCount = customers ? customers.length : 0;
  const totalOrdersCount = orders?.totalOrders ?? 0;

  const lowStockProducts = useMemo(() => {
    return productData?.products?.filter(p => p.countInStock <= 5) || [];
  }, [productData]);

  // Simulate live feed
  useEffect(() => {
    const interval = setInterval(() => {
      const cities = ['Bangalore', 'Chennai', 'Pune', 'Hyderabad', 'Kolkata'];
      const city = cities[Math.floor(Math.random() * cities.length)];
      const newActivity = {
        id: Date.now(),
        type: Math.random() > 0.5 ? 'order' : 'user',
        msg: Math.random() > 0.5 ? `New order arriving from verified customer` : `User authentication successful`,
        time: 'Just now'
      };
      setActivities(prev => [newActivity, ...prev.slice(0, 4)]);
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  const chartSeries = useMemo(() => {
    if (!salesDetail) return [];
    
    if (chartType === "pie") {
      // For pie chart, we just take the total sales values
      return salesDetail.map((item) => item.totalSales);
    }
    
    return [{
      name: "Revenue",
      data: salesDetail.map((item) => item.totalSales)
    }];
  }, [salesDetail, chartType]);

  const chartOptions = useMemo(() => {
    const categories = (salesDetail || []).map((item) => item._id);
    
    const baseOptions = {
      chart: {
        id: "revenue-chart",
        toolbar: { show: false },
        fontFamily: 'Inter, sans-serif',
      },
      colors: ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6"],
      theme: { mode: document.documentElement.classList.contains('dark') ? 'dark' : 'light' },
      tooltip: { theme: "dark" },
    };

    if (chartType === "pie") {
      return {
        ...baseOptions,
        labels: categories,
        legend: { position: 'bottom' },
        plotOptions: {
          pie: {
            donut: { size: '65%' }
          }
        }
      };
    }

    return {
      ...baseOptions,
      xaxis: {
        categories,
        labels: { style: { colors: "#94a3b8" } }
      },
      yaxis: {
        labels: { 
          style: { colors: "#94a3b8" },
          formatter: (val) => `₹${val.toLocaleString()}`
        }
      },
      grid: { borderColor: "rgba(148, 163, 184, 0.1)" },
      dataLabels: { enabled: false },
      stroke: { curve: chartType === "line" ? "smooth" : "straight", width: 3 },
    };
  }, [salesDetail, chartType]);

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="flex flex-col gap-8 p-2 sm:p-4"
    >
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Analytics Command Center
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Real-time performance and revenue tracking</p>
        </div>
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
           {["bar", "line", "pie"].map((type) => (
             <button
               key={type}
               onClick={() => setChartType(type)}
               className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                 chartType === type 
                   ? "bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm" 
                   : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
               }`}
             >
               {type === "bar" && <FaChartBar />}
               {type === "line" && <FaChartLine />}
               {type === "pie" && <FaChartPie />}
               <span className="capitalize">{type}</span>
             </button>
           ))}
        </div>
      </header>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Sales Card */}
        <motion.div variants={itemVariants}>
          <Link to="/admin/orders" className="premium-card group block p-6 rounded-2xl h-full">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 text-xl group-hover:scale-110 transition-transform duration-500">
                <FaDollarSign />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded">Live</span>
            </div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Revenue</p>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mt-1">
              {loadingSales ? <Loader /> : `₹${totalSalesValue.toLocaleString()}`}
            </h2>
            <div className="mt-4 flex items-center gap-2 text-xs text-emerald-500">
              <span className="font-bold">↑ 12%</span>
              <span className="text-slate-400 font-normal">vs last month</span>
            </div>
          </Link>
        </motion.div>

        {/* Customers Card */}
        <motion.div variants={itemVariants}>
          <Link to="/admin/users" className="premium-card group block p-6 rounded-2xl h-full">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 text-xl group-hover:scale-110 transition-transform duration-500">
                <FaUsers />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-blue-500 bg-blue-500/10 px-2 py-1 rounded">Growth</span>
            </div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Customers</p>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mt-1">
              {loadingCustomers ? <Loader /> : customersCount.toLocaleString()}
            </h2>
            <div className="mt-4 flex items-center gap-2 text-xs text-blue-500">
              <span className="font-bold">+ {Math.floor(customersCount * 0.05)}</span>
              <span className="text-slate-400 font-normal">new this week</span>
            </div>
          </Link>
        </motion.div>

        {/* Orders Card */}
        <motion.div variants={itemVariants}>
          <Link to="/admin/orders" className="premium-card group block p-6 rounded-2xl h-full">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500 text-xl group-hover:scale-110 transition-transform duration-500">
                <FaShoppingCart />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-amber-500 bg-amber-500/10 px-2 py-1 rounded">Active</span>
            </div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Orders</p>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mt-1">
              {loadingOrders ? <Loader /> : totalOrdersCount.toLocaleString()}
            </h2>
            <div className="mt-4 flex items-center gap-2 text-xs text-amber-500">
              <span className="font-bold">4.8/5</span>
              <span className="text-slate-400 font-normal">avg fulfillment</span>
            </div>
          </Link>
        </motion.div>
      </div>

      {/* Chart Section */}
      <motion.div variants={itemVariants} className="premium-card rounded-3xl p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Revenue Performance</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">Detailed breakdown of income streams</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Total Sales</span>
            </div>
          </div>
        </div>
        
        <div className="w-full">
          {salesDetail ? (
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
               <div className="xl:col-span-2">
                  <Chart 
                    options={chartOptions} 
                    series={chartSeries} 
                    type={chartType} 
                    height={400} 
                    width="100%" 
                  />
               </div>
               {/* Category Distribution / Mini Stats */}
               <div className="flex flex-col gap-6">
                  <div className="p-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700/50">
                     <h4 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">Traffic Insights</h4>
                     <div className="space-y-4">
                        {[
                          { label: 'Mobile App', val: '64%', color: 'bg-emerald-500' },
                          { label: 'Web Portal', val: '28%', color: 'bg-blue-500' },
                          { label: 'API Integrations', val: '8%', color: 'bg-amber-500' }
                        ].map(item => (
                          <div key={item.label}>
                             <div className="flex justify-between text-xs font-bold mb-1">
                                <span className="text-slate-600 dark:text-slate-400">{item.label}</span>
                                <span className="text-slate-900 dark:text-white">{item.val}</span>
                             </div>
                             <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                <div className={`h-full ${item.color} rounded-full`} style={{ width: item.val }} />
                             </div>
                          </div>
                        ))}
                     </div>
                  </div>
                  
                  {/* Live Activity Ticker */}
                  <div className="flex-1 p-5 bg-slate-950 rounded-2xl border border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.05)] overflow-hidden">
                     <div className="flex items-center justify-between mb-4">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-emerald-500 flex items-center gap-2">
                           <span className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                           </span>
                           Live Pulse
                        </h4>
                        <FaRss className="text-emerald-500/50 animate-pulse" />
                     </div>
                     <div className="space-y-3">
                        {activities.map(act => (
                          <motion.div 
                            key={act.id}
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            className="flex items-start gap-3 p-2 rounded-lg bg-white/5 border border-white/5"
                          >
                             <div className={`mt-1 w-1.5 h-1.5 rounded-full shrink-0 ${act.type === 'order' ? 'bg-emerald-400' : act.type === 'stock' ? 'bg-rose-400' : 'bg-blue-400'}`} />
                             <div>
                                <p className="text-[11px] font-medium text-slate-300 leading-tight">{act.msg}</p>
                                <p className="text-[9px] text-slate-500 mt-0.5">{act.time}</p>
                             </div>
                          </motion.div>
                        ))}
                     </div>
                  </div>
               </div>
            </div>
          ) : (
            <div className="h-[400px] flex items-center justify-center">
              <Loader />
            </div>
          )}
        </div>
      </motion.div>

      {/* Insights Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         {/* Top Customers List */}
         <motion.div variants={itemVariants} className="premium-card rounded-3xl overflow-hidden flex flex-col">
            <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
               <h3 className="text-lg font-bold text-slate-900 dark:text-white">Recent Customer Activity</h3>
            </div>
            <div className="flex-1 overflow-y-auto max-h-[300px]">
               {loadingCustomers ? <Loader /> : (
                 <div className="divide-y divide-slate-100 dark:divide-slate-800/50">
                    {customers?.slice(0, 5).map(user => (
                      <div key={user._id} className="flex items-center gap-4 p-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                         <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                            {user.profilePic ? <img src={user.profilePic} className="w-full h-full rounded-full object-cover" /> : <FaUserCircle size={24} />}
                         </div>
                         <div className="flex-1">
                            <p className="text-sm font-bold text-slate-900 dark:text-white">{user.username}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">{user.email}</p>
                         </div>
                         <div className="text-right">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-blue-500 bg-blue-500/10 px-2 py-1 rounded">VIP</span>
                         </div>
                      </div>
                    ))}
                 </div>
               )}
            </div>
         </motion.div>

         {/* Low Stock Watchlist */}
         <motion.div variants={itemVariants} className="premium-card rounded-3xl overflow-hidden flex flex-col">
            <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 flex items-center justify-between">
               <h3 className="text-lg font-bold text-slate-900 dark:text-white">Inventory Watchlist</h3>
               <span className="text-xs font-bold text-rose-500 flex items-center gap-1">
                  <FaExclamationTriangle /> Critical Levels
               </span>
            </div>
            <div className="flex-1 overflow-y-auto max-h-[300px]">
               <div className="divide-y divide-slate-100 dark:divide-slate-800/50">
                  {lowStockProducts.length === 0 ? (
                    <div className="p-10 text-center text-slate-400 text-sm italic">Inventory is fully optimized.</div>
                  ) : (
                    lowStockProducts.map(p => (
                      <div key={p._id} className="flex items-center gap-4 p-4">
                         <img src={p.image} alt={p.name} className="w-10 h-10 rounded-lg object-cover bg-slate-100" />
                         <div className="flex-1">
                            <p className="text-sm font-bold text-slate-900 dark:text-white truncate max-w-[200px]">{p.name}</p>
                            <p className="text-[10px] text-slate-500 font-bold uppercase">{p.brand}</p>
                         </div>
                         <div className="text-right">
                            <p className={`text-xs font-black ${p.countInStock === 0 ? 'text-rose-600' : 'text-amber-500'}`}>
                               {p.countInStock} Left
                            </p>
                            <div className="w-16 h-1 bg-slate-100 dark:bg-slate-800 rounded-full mt-1">
                               <div className="h-full bg-rose-500 rounded-full" style={{ width: `${(Math.min(p.countInStock, 20) / 20) * 100}%` }} />
                            </div>
                         </div>
                      </div>
                    ))
                  )}
               </div>
            </div>
         </motion.div>
      </div>

      {/* Recent Orders Overview */}
      <motion.div variants={itemVariants} className="premium-card rounded-3xl overflow-hidden">
        <div className="px-6 py-5 sm:px-8 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Fulfillment Queue</h3>
          <Link to="/admin/orders" className="text-emerald-500 text-sm font-bold hover:underline px-3 py-1 rounded-lg hover:bg-emerald-500/10 transition-colors">View All</Link>
        </div>
        <div className="p-0 overflow-hidden">
          <OrderList insideDashboard={true} />
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AdminDashboard;
