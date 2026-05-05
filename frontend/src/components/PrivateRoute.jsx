import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import React from 'react';

const PrivateRoute = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const location = useLocation();

  // Passing the current location to the login page so the user can be redirected back after authentication
  return userInfo ? (
    <Outlet />
  ) : (
    <Navigate to={`/login?redirect=${location.pathname}${location.search}`} replace />
  );
};

export default PrivateRoute;
// This component checks if the user is authenticated by looking for userInfo in the Redux store.
// If userInfo exists, it renders the child components (Outlet).
// If not, it redirects the user to the login page using Navigate.
// This is useful for protecting routes that should only be accessible to authenticated users.