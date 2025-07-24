import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import Loader from "../base/loader/Loader";

const ProtectedRoute = ({ children }) => {
  const token = sessionStorage.getItem("authToken");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const delay = setTimeout(() => {
      setLoading(false);
    }, 2000); // 2 seconds ⏱️

    return () => clearTimeout(delay); // cleanup
  }, []);

  if (loading) {
    return <Loader />; // 🎯 your custom animation
  }

  if (!token) {
    console.warn("Access denied ❌ No auth token found");
    return <Navigate to="/user/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
