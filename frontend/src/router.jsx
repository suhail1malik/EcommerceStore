import React, { lazy, Suspense } from "react";
import {
  Route,
  Navigate,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";

import PrivateRoute from "./components/PrivateRoute.jsx";
import LoadingSpinner from "./components/LoadingSpinner.jsx";
import ErrorFallback from "./components/ErrorFallback.jsx";
import AddProducts from "./pages/Admin/AddProducts.jsx";

// Public + user pages
const App = lazy(() => import("./App.jsx"));
const Login = lazy(() => import("./pages/Auth/Login.jsx"));
const Register = lazy(() => import("./pages/Auth/Register.jsx"));
const ForgotPassword = lazy(() => import("./pages/Auth/ForgotPassword.jsx"));
const ResetPassword = lazy(() => import("./pages/Auth/ResetPassword.jsx"));
const Home = lazy(() => import("./pages/Home.jsx"));
const Profile = lazy(() => import("./pages/User/Profile.jsx"));
const Favorites = lazy(() => import("./pages/Products/Favorites.jsx"));
const ProductDetails = lazy(() =>
  import("./pages/Products/ProductDetails.jsx")
);
const Shop = lazy(() => import("./pages/Shop.jsx"));
const Shipping = lazy(() => import("./pages/Orders/Shipping.jsx"));
const Payment = lazy(() => import("./pages/Orders/Payment.jsx"));
const PlaceOrder = lazy(() => import("./pages/Orders/PlaceOrder.jsx"));
const Order = lazy(() => import("./pages/Orders/Order.jsx"));
const Cart = lazy(() => import("./pages/Cart.jsx"));
const NotFound = lazy(() => import("./pages/NotFound.jsx"));

// Admin pages
const AdminDashboard = lazy(() => import("./pages/Admin/AdminDashboard.jsx"));
const AllProducts = lazy(() => import("./pages/Admin/AllProducts.jsx"));
const CategoryList = lazy(() => import("./pages/Admin/CategoryList.jsx"));
const OrderList = lazy(() => import("./pages/Admin/OrderList.jsx"));
const ProductList = lazy(() => import("./pages/Admin/AddProducts.jsx"));
const ProductUpdate = lazy(() => import("./pages/Admin/ProductUpdate.jsx"));
const UserList = lazy(() => import("./pages/Admin/UserList.jsx"));
const AdminRoute = lazy(() => import("./pages/Admin/AdminRoute.jsx"));
const AdminLayout = lazy(() => import("./pages/Admin/AdminLayout.jsx"));

// Reusable wrappers
const WithSuspense = ({ children }) => (
  // Using null fallback eliminates UI jitter during micro-transitions (FLOC)
  <Suspense fallback={null}>{children}</Suspense>
);

const WithErrorBoundary = ({ children }) => (
  <ErrorBoundary FallbackComponent={ErrorFallback}>{children}</ErrorBoundary>
);

const LazyRouteWrapper = ({ children }) => (
  <WithErrorBoundary>
    <WithSuspense>{children}</WithSuspense>
  </WithErrorBoundary>
);

const routes = createRoutesFromElements(
  <Route
    path="/"
    element={
      <WithSuspense>
        <App />
      </WithSuspense>
    }
  >
    {/* Public routes */}
    <Route path="login" element={<Login />} />
    <Route path="register" element={<Register />} />
    <Route path="forgot-password" element={<ForgotPassword />} />
    <Route path="reset-password/:token" element={<ResetPassword />} />
    <Route index element={<Home />} />
    <Route path="favorite" element={<Favorites />} />
    <Route path="product/:id" element={<ProductDetails />} />
    <Route path="cart" element={<Cart />} />
    <Route path="shop" element={<Shop />} />
    <Route path="home" element={<Navigate to="/" replace />} />
    <Route path="*" element={<NotFound />} />

    {/* Protected user routes */}
    <Route element={<PrivateRoute />}>
      <Route path="profile" element={<Profile />} />
      <Route path="shipping" element={<Shipping />} />
      <Route path="payment" element={<Payment />} />
      <Route path="placeorder" element={<PlaceOrder />} />
      <Route path="order/:id" element={<Order />} />
    </Route>

    {/* Admin routes */}
    <Route
      path="admin"
      element={
        <WithSuspense>
          <AdminRoute />
        </WithSuspense>
      }
    >
      <Route element={<AdminLayout />}>
        <Route
          index
          element={
            <LazyRouteWrapper>
              <AdminDashboard />
            </LazyRouteWrapper>
          }
        />
        <Route
          path="users"
          element={
            <LazyRouteWrapper>
              <UserList />
            </LazyRouteWrapper>
          }
        />
        <Route
          path="categories"
          element={
            <LazyRouteWrapper>
              <CategoryList />
            </LazyRouteWrapper>
          }
        />
        <Route
          path="addProducts"
          element={
            <LazyRouteWrapper>
              <AddProducts />
            </LazyRouteWrapper>
          }
        />
        <Route
          path="products/page/:pageNumber"
          element={
            <LazyRouteWrapper>
              <ProductList />
            </LazyRouteWrapper>
          }
        />
        <Route
          path="products/:id/edit"
          element={
            <LazyRouteWrapper>
              <ProductUpdate />
            </LazyRouteWrapper>
          }
        />
        <Route
          path="all-products"
          element={
            <LazyRouteWrapper>
              <AllProducts />
            </LazyRouteWrapper>
          }
        />
        <Route
          path="orders"
          element={
            <LazyRouteWrapper>
              <OrderList />
            </LazyRouteWrapper>
          }
        />
      </Route>
    </Route>
  </Route>
);

export const router = createBrowserRouter(routes, {
  future: { v7_startTransition: true, v7_relativeSplatPath: true },
});
