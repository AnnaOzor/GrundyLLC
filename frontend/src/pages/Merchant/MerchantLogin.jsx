// src/pages/Merchant/MerchantLogin.jsx
import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { MerchantContext } from "../../context/MerchantContext";
import "react-toastify/dist/ReactToastify.css";
import "./Merchant.css";

const MerchantLogin = ({ url }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { loginMerchant } = useContext(MerchantContext);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${url}/api/merchant/login`, {
        email,
        password,
      });

      if (response.data.success) {
        loginMerchant(response.data.token, response.data.merchant._id);
        toast.success("Login successful!");
        navigate("/merchant/dashboard", { replace: true });
      } else {
        toast.error(response.data.message || "Login failed");
      }
    } catch (error) {
      console.error(error);
      toast.error("Server error during login");
    }
  };

  return (
    <div className="merchant-login">
      <h2>Merchant Login</h2>
      <form onSubmit={handleSubmit} className="login-form">
        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default MerchantLogin;
