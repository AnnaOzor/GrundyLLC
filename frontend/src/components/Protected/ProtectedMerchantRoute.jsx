import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { MerchantContext } from "../../context/MerchantContext";

const ProtectedMerchantRoute = ({ children }) => {
  const { merchantToken, merchantId } = useContext(MerchantContext);
  const clientToken = localStorage.getItem("token");

  if (!merchantToken || !merchantId || clientToken) {
    return <Navigate to="/merchant/login" replace />;
  }

  return children;
};

export default ProtectedMerchantRoute;
