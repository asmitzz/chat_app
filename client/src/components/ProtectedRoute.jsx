import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const isUserLoggedIn = localStorage.getItem("isUserLoggedIn")

  useEffect(() => {
    if (!isUserLoggedIn) {
      navigate("/login");
    }
  }, [isUserLoggedIn, navigate]);
  
  return <div>{children}</div>;
};

export default ProtectedRoute;
