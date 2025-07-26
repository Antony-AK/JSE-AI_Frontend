import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import Loader from "../base/loader/Loader";

const ProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
    const [tokenExists, setTokenExists] = useState(false);


   useEffect(() => {
    const token = sessionStorage.getItem("authToken");

    if (token) {
      setTokenExists(true);
      setLoading(false); // ✅ No delay needed if token exists
    } else {
      // ❌ No token — show loader briefly before redirecting
      const timeout = setTimeout(() => {
        setLoading(false);
      }, 500); // Just a small delay

      return () => clearTimeout(timeout);
    }
  }, []);

  if (loading) {
    return <Loader />; // 🎯 your custom animation
  }

  if (!tokenExists) {
    console.warn("Access denied ❌ No auth token found");
    return <Navigate to="/user/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
