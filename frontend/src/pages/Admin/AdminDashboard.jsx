// src/pages/admin/AdminDashboard.jsx
import { useMemo } from "react";
import Chart from "react-apexcharts";

import { useGetUsersQuery } from "../../redux/api/usersApiSlice";
import {
  useGetTotalOrdersQuery,
  useGetTotalSalesByDateQuery,
  useGetTotalSalesQuery,
} from "../../redux/api/orderApiSlice";

import AdminMenu from "./AdminMenu";
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
    <>
      <AdminMenu />

      <section className="xl:ml-[4rem] md:ml-[0rem]">
        <div className="w-[80%] flex justify-around flex-wrap">
          {/* Sales Card */}
          <div className="rounded-lg bg-black p-5 w-[20rem] mt-5">
            <div className="font-bold rounded-full w-[3rem] bg-pink-500 text-center p-3">
              $
            </div>
            <p className="mt-5">Sales</p>
            <h1 className="text-xl font-bold">
              {loadingSales ? <Loader /> : `$ ${totalSalesValue.toFixed(2)}`}
            </h1>
          </div>

          {/* Customers Card */}
          <div className="rounded-lg bg-black p-5 w-[20rem] mt-5">
            <div className="font-bold rounded-full w-[3rem] bg-pink-500 text-center p-3">
              👥
            </div>
            <p className="mt-5">Customers</p>
            <h1 className="text-xl font-bold">
              {loadingCustomers ? <Loader /> : customersCount}
            </h1>
          </div>

          {/* Orders Card */}
          <div className="rounded-lg bg-black p-5 w-[20rem] mt-5">
            <div className="font-bold rounded-full w-[3rem] bg-pink-500 text-center p-3">
              🧾
            </div>
            <p className="mt-5">All Orders</p>
            <h1 className="text-xl font-bold">
              {loadingOrders ? <Loader /> : totalOrdersCount}
            </h1>
          </div>
        </div>

        {/* Chart — use same type as options (line) and numeric width */}
        <div className="ml-[10rem] mt-[4rem]">
          <Chart options={options} series={series} type="line" width={700} />
        </div>

        {/* Orders list */}
        <div className="mt-[4rem]">
          <OrderList />
        </div>
      </section>
    </>
  );
};

export default AdminDashboard;
