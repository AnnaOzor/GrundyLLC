// src/components/PaystackButton.jsx
import React from "react";
import { PaystackButton } from "react-paystack";

const PayButton = ({ email, amount, onSuccess, onClose }) => {
  const config = {
    email,
    amount, // in kobo (₦5,000 = 500000)
    publicKey: "pk_test_28652f8f09044af0310d759f840e3136ea089fea",
    channels: ["card", "bank", "ussd"], // optional
  };

  return (
    <PaystackButton
      {...config}
      text="Pay Now"
      onSuccess={onSuccess}
      onClose={onClose}
    />
  );
};

export default PayButton;
