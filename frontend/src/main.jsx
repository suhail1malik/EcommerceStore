import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { ErrorBoundary } from "react-error-boundary";

import "./index.css";
import store from "./redux/store.js";
import { router } from "./router.jsx";
import { RouterProvider } from "react-router-dom";
import LoadingSpinner from "./components/LoadingSpinner.jsx";
import ErrorFallback from "./components/ErrorFallback.jsx";
import { ThemeProvider } from "./components/ThemeProvider.jsx";

// const WithErrorBoundary = ({ children }) => (
//   <ErrorBoundary FallbackComponent={ErrorFallback}>{children}</ErrorBoundary>
// );

const WithErrorBoundary = ({ children }) => (
  <ErrorBoundary
    FallbackComponent={ErrorFallback}
    onError={(error, info) => {
      // Log to Sentry/Console
      console.error("App crash:", error, info);
    }}
    resetKeys={[location.pathname]} // Reset on route change
  >
    {children}
  </ErrorBoundary>
);

import { HelmetProvider } from "react-helmet-async";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <HelmetProvider>
      <WithErrorBoundary>
        <Provider store={store}>
          <ThemeProvider>
            <RouterProvider
              router={router}
              fallbackElement={<LoadingSpinner />}
            />
          </ThemeProvider>
        </Provider>
      </WithErrorBoundary>
    </HelmetProvider>
  </StrictMode>
);
