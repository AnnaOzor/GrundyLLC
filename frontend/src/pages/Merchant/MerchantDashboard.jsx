import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Merchant.css";

const MerchantDashboard = ({ url }) => {
  const token = localStorage.getItem("merchantToken");
  const [merchant, setMerchant] = useState(null);
  const [groceries, setGroceries] = useState([]);

  // Fetch merchant details
  const fetchMerchant = async () => {
    try {
      const res = await axios.get(`${url}/api/merchant/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) setMerchant(res.data.merchant);
      else toast.error("Failed to fetch merchant details");
    } catch {
      toast.error("Server error fetching merchant details");
    }
  };

  // Fetch merchant-specific groceries
  const fetchGroceries = async () => {
    try {
      const res = await axios.get(`${url}/api/grocery/list`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) setGroceries(res.data.data);
      else toast.info("No groceries found. Add some products to display your stock.");
    } catch {
      toast.error("Server error fetching groceries");
    }
  };

  // Logout handler
  const logout = () => {
    localStorage.removeItem("merchantToken");
    localStorage.removeItem("merchantId");
    window.location.href = "/merchant/login"; // redirect to merchant login
  };

  useEffect(() => {
    fetchMerchant();
    fetchGroceries();
  }, []);

  return (
    <div className="merchant-dashboard">
      <div className="dashboard-header">
        <h2>Merchant Dashboard</h2>
        <button onClick={logout} className="logout-btn">Logout</button>
      </div>

      {merchant && (
        <div className="merchant-info">
          <h3>{merchant.name}</h3>
          <p>Email: {merchant.email}</p>
          <p>Phone: {merchant.contact_phone}</p>
          <p>Vendor Categories: {merchant.categories.join(", ")}</p>
          <p>Split Code: {merchant.split_code}</p>
        </div>
      )}

      <h3>Your Stock</h3>
      {groceries.length === 0 && <p>No groceries found. Add some products to display your stock.</p>}
      <div className="merchant-stock-grid">
        {groceries.map((item) => (
          <div key={item._id} className="merchant-stock-card">
            <img src={`${url}/uploads/${item.image}`} alt={item.name} />
            <h4>{item.name}</h4>
            <p>{item.category}</p>
            <p>₦{Number(item.price).toLocaleString()}</p>
            <p>Status: {item.out_of_stock ? "Out of Stock" : "Available"}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MerchantDashboard;
