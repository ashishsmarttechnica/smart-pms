import React, { useEffect, useState } from 'react';
import { Outlet, Navigate, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { getAdminDetails } from '../../../Services/Redux/Action/AuthAction';

const AuthSecureRoutes = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // State to track authentication status
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const authToken = localStorage.getItem('token'); // Retrieve token from localStorage

    if (authToken) {
      // Verify token with the server
      dispatch(getAdminDetails(authToken))
        .then((response) => {
          if (response?.success) {
            setIsAuthenticated(true); // Authentication successful
          } else {
            localStorage.clear(); // Clear invalid token and other data
            navigate('/'); // Redirect to login
            setIsAuthenticated(false); // Not authenticated
          }
        })
        .catch(() => {
          localStorage.clear();
          navigate('/');
          setIsAuthenticated(false);
        });
    } else {
      setIsAuthenticated(false); // No token means not authenticated
    }
  }, [dispatch, navigate]);

  if (isAuthenticated === null) {
    // Return null or a loader while checking authentication status
    return <div>Loading...</div>;
  }

  // If authenticated, redirect to home page
  if (isAuthenticated) {
    return <Navigate to="/home" />;
  }

  // If not authenticated, allow access to child routes (e.g., Login)
  return <Outlet />;
};

export default AuthSecureRoutes;
