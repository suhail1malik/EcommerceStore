import React, { lazy, Suspense } from "react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import store from "./redux/store.js";
import { Provider } from "react-redux";
import {
  Route,
  createRoutesFromElements,
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
import PrivateRoute from "./components/PrivateRoute.jsx";
import LoadingSpinner from "./components/LoadingSpinner.jsx";
import ErrorFallback from "./components/ErrorFallback.jsx";
import { ThemeProvider } from "./components/ThemeProvider.jsx";

/* Lazy pages (keep header/footer non-lazy if always used) */
const App = lazy(() => import("./App.jsx"));
const Login = lazy(() => import("./pages/Auth/Login.jsx"));
const Register = lazy(() => import("./pages/Auth/Register.jsx"));
const Home = lazy(() => import("./pages/Home.jsx"));
const Profile = lazy(() => import("./pages/User/Profile.jsx"));
const Favorites = lazy(() => import("./pages/Products/Favorites.jsx"));
const ProductDetails = lazy(() =>
  import("./pages/Products/ProductDetails.jsx")
);
const Shop = lazy(() => import("./pages/Shop.jsx"));
const Shipping = lazy(() => import("./pages/Orders/Shipping.jsx"));
const PlaceOrder = lazy(() => import("./pages/Orders/PlaceOrder.jsx"));
const Order = lazy(() => import("./pages/Orders/Order.jsx"));
const Cart = lazy(() => import("./pages/Cart.jsx"));

/* Admin pages — lazy to keep admin bundle separate */
const AdminDashboard = lazy(() => import("./pages/Admin/AdminDashboard.jsx"));
const AllProducts = lazy(() => import("./pages/Admin/AllProducts.jsx"));
const CategoryList = lazy(() => import("./pages/Admin/CategoryList.jsx"));
const OrderList = lazy(() => import("./pages/Admin/OrderList.jsx"));
const ProductList = lazy(() => import("./pages/Admin/ProductList.jsx"));
const ProductUpdate = lazy(() => import("./pages/Admin/ProductUpdate.jsx"));
const UserList = lazy(() => import("./pages/Admin/UserList.jsx"));
const AdminRoute = lazy(() => import("./pages/Admin/AdminRoute.jsx"));

/* LazyRouteWrapper (was missing) */
const LazyRouteWrapper = ({ children }) => (
  <ErrorBoundary FallbackComponent={ErrorFallback}>
    <Suspense fallback={<LoadingSpinner />}>{children}</Suspense>
  </ErrorBoundary>
);

/* Single route-level wrapper: Suspense only once for all routes */
const routes = createRoutesFromElements(
  <Route
    path="/"
    element={
      <Suspense fallback={<LoadingSpinner />}>
        <App />
      </Suspense>
    }
  >
    <Route path="login" element={<Login />} />
    <Route path="register" element={<Register />} />
    <Route index element={<Home />} />
    <Route path="favorite" element={<Favorites />} />
    <Route path="product/:id" element={<ProductDetails />} />
    <Route path="cart" element={<Cart />} />
    <Route path="shop" element={<Shop />} />
    <Route path="home" element={<Navigate to="/" replace />} />
    <Route path="*" element={<Navigate to="/" replace />} />

    {/* Protected routes */}
    <Route element={<PrivateRoute />}>
      <Route path="profile" element={<Profile />} />
      <Route path="shipping" element={<Shipping />} />
      <Route path="placeorder" element={<PlaceOrder />} />
      <Route path="order/:id" element={<Order />} />
    </Route>

    {/* Admin routes — use AdminRoute (role-based) */}
    <Route path="admin" element={<AdminRoute />}>
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
        path="products"
        element={
          <LazyRouteWrapper>
            <ProductList />
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
);

const router = createBrowserRouter(routes, {
  future: { v7_startTransition: true, v7_relativeSplatPath: true },
});

const Root = () => (
  <ErrorBoundary
    FallbackComponent={ErrorFallback}
    onError={(err, info) => {
      // send to logging (Sentry/console)
      console.error(err, info);
    }}
    // remove resetKeys empty array — add meaningful keys if needed
  >
    <Provider store={store}>
      <ThemeProvider>
        <RouterProvider router={router} fallbackElement={<LoadingSpinner />} />
      </ThemeProvider>
    </Provider>
  </ErrorBoundary>
);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Root />
  </StrictMode>
);
