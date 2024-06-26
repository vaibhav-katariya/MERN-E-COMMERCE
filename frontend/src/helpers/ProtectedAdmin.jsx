import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router";

const ProtectedAdmin = () => {
  const user = useSelector((state) => state.user.user);

  if (!user) {
    return <Navigate to="/login" replace={true}></Navigate>;
  }
  if (user && user.role !== "admin") {
    return <Navigate to="/" replace={true}></Navigate>;
  }
};

export default ProtectedAdmin;
