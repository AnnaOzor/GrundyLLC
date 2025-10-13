import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './Orders.css';

const Orders = ({ url }) => {
  const [orders, setOrders] = useState([]);
  const token = localStorage.getItem('adminToken');

  const fetchOrders = async () => {
    if (!token) return toast.error("Please login as admin first");
    try {
      const res = await axios.get(`${url}/api/orders/list`, { headers: { Authorization: `Bearer ${token}` } });
      if (res.data.success) setOrders(res.data.data);
      else toast.error("Error fetching orders");
    } catch (err) {
      console.error("Fetch orders error:", err.response || err);
      toast.error("Server error fetching orders");
    }
  };

  useEffect(() => { fetchOrders(); }, [token]);

  return (
    <div className="orders">
      <h2>All Orders</h2>
      {orders.length === 0 ? <p>No orders found.</p> :
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Total</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{order.customerName}</td>
                <td>₦{Number(order.total).toLocaleString()}</td>
                <td>{order.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      }
    </div>
  );
};

export default Orders;
