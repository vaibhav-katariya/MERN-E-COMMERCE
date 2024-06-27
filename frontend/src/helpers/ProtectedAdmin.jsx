import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router";

const ProtectedAdmin = ({ children }) => {
  const user = useSelector((state) => state.user.user);

  if (user.role !== "admin") {
    return <Navigate to="/"></Navigate>;
  }

  return children;
};

export default ProtectedAdmin;
