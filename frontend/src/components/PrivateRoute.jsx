import {Navigate, Outlet} from 'react-router-dom';
import {useSelector} from 'react-redux';
import React from 'react';

const PrivateRoute = () => {
  const {userInfo} = useSelector((state) => state.auth);
  return userInfo ? <Outlet /> : <Navigate to="/login" replace />;
}

export default PrivateRoute;
// This component checks if the user is authenticated by looking for userInfo in the Redux store.
// If userInfo exists, it renders the child components (Outlet).
// If not, it redirects the user to the login page using Navigate.
// This is useful for protecting routes that should only be accessible to authenticated users.