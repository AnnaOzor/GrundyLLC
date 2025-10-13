// src/pages/PaymentPage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import PayButton from "../../components/PaystackButton/PaystackButton";

const PaymentPage = () => {
  const navigate = useNavigate();

  const handleSuccess = (reference) => {
    // Redirect to /payment/success with the transaction reference
    navigate(`/payment/success?reference=${reference.reference}`);
  };

  const handleClose = () => {
    alert("Payment was closed without completing.");
  };

  return (
    <div style={{ textAlign: "center", padding: "2rem" }}>
      <h1>Paystack Test Payment</h1>
      <PayButton
        email="customer@example.com"
        amount={500000} // ₦5,000 in kobo
        onSuccess={handleSuccess}
        onClose={handleClose}
      />
    </div>
  );
};

export default PaymentPage;
