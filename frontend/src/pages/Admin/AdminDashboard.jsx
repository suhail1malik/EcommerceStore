// src/pages/admin/AdminDashboard.jsx
import { useMemo } from "react";
import Chart from "react-apexcharts";
import { Link } from "react-router-dom";

import { useGetUsersQuery } from "../../redux/api/usersApiSlice";
import {
  useGetTotalOrdersQuery,
  useGetTotalSalesByDateQuery,
  useGetTotalSalesQuery,
} from "../../redux/api/orderApiSlice";

import OrderList from "./OrderList";
import Loader from "../../components/Loader";

const AdminDashboard = () => {
  // RTK Query hooks (distinct loading flags)
  const { data: sales, isLoading: loadingSales } = useGetTotalSalesQuery();
  const { data: customers, isLoading: loadingCustomers } = useGetUsersQuery();
  const { data: orders, isLoading: loadingOrders } = useGetTotalOrdersQuery();
  const { data: salesDetail } = useGetTotalSalesByDateQuery();

  // safe derived values
  const totalSalesValue = sales?.totalSales ?? 0;
  const customersCount = customers ? customers.length : 0;
  const totalOrdersCount = orders?.totalOrders ?? 0;

  // series derived from salesDetail (memoized)
  const series = useMemo(() => {
    if (!salesDetail) return [{ name: "Sales", data: [] }];
    const data = salesDetail.map((item) => item.totalSales);
    return [{ name: "Sales", data }];
  }, [salesDetail]);

  // options memoized and using categories from salesDetail
  const options = useMemo(() => {
    return {
      chart: { type: "line", toolbar: { show: false } },
      tooltip: { theme: "dark" },
      dataLabels: { enabled: true },
      stroke: { curve: "smooth" },
      title: { text: "Sales Trend", align: "left" },
      grid: { borderColor: "#ccc" },
      markers: { size: 1 },
      xaxis: {
        categories: (salesDetail || []).map((item) => item._id),
        title: { text: "Date" },
      },
      yaxis: { title: { text: "Sales" }, min: 0 },
      legend: {
        position: "top",
        horizontalAlign: "right",
        floating: true,
        offsetY: -25,
        offsetX: -5,
      },
    };
  }, [salesDetail]);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-100">
        Dashboard Overview
      </h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Sales Card */}
        <Link to="/admin/orders" className="block rounded-xl bg-white dark:bg-slate-800 shadow-sm border border-gray-100 dark:border-slate-700 p-6 flex flex-col items-start transition-all hover:scale-[1.02] hover:shadow-md hover:border-emerald-500/30 group cursor-pointer w-full">
          <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 text-xl mb-4 group-hover:scale-110 transition-transform">
            💲
          </div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">Total Sales</p>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-slate-100 mt-1">
            {loadingSales ? <Loader /> : `$${totalSalesValue.toFixed(2)}`}
          </h2>
        </Link>

        {/* Customers Card */}
        <Link to="/admin/users" className="block rounded-xl bg-white dark:bg-slate-800 shadow-sm border border-gray-100 dark:border-slate-700 p-6 flex flex-col items-start transition-all hover:scale-[1.02] hover:shadow-md hover:border-emerald-500/30 group cursor-pointer w-full">
          <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 text-xl mb-4 group-hover:scale-110 transition-transform">
            👥
          </div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">Customers</p>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-slate-100 mt-1">
            {loadingCustomers ? <Loader /> : customersCount}
          </h2>
        </Link>

        {/* Orders Card */}
        <Link to="/admin/orders" className="block rounded-xl bg-white dark:bg-slate-800 shadow-sm border border-gray-100 dark:border-slate-700 p-6 flex flex-col items-start transition-all hover:scale-[1.02] hover:shadow-md hover:border-emerald-500/30 group cursor-pointer w-full sm:col-span-2 lg:col-span-1">
          <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 text-xl mb-4 group-hover:scale-110 transition-transform">
            🧾
          </div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">All Orders</p>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-slate-100 mt-1">
            {loadingOrders ? <Loader /> : totalOrdersCount}
          </h2>
        </Link>
      </div>

      {/* Chart */}
      <div className="bg-white dark:bg-slate-800 shadow-sm border border-gray-100 dark:border-slate-700 rounded-xl p-6 w-full">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-slate-200 mb-4">Revenue Analytics</h3>
        <div className="w-full overflow-x-auto">
          <div className="min-w-[600px]">
            <Chart options={options} series={series} type="line" height={350} width="100%" />
          </div>
        </div>
      </div>

      {/* Recent Orders Overview */}
      <div className="bg-white dark:bg-slate-800 shadow-sm border border-gray-100 dark:border-slate-700 rounded-xl overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-slate-200">Recent Orders</h3>
        </div>
        <div className="-mt-8">
          <OrderList insideDashboard={true} />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
