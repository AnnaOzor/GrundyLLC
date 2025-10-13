import React, { useState, useEffect, useContext } from 'react';
import './PlaceOrder.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import jwtDecode from 'jwt-decode';

const PlaceOrder = () => {
  const { grocery_list, cartItems, url } = useContext(StoreContext);
  const location = useLocation();
  const navigate = useNavigate();

  const { merchantId: merchantIdFromState } = location.state || {};

  const [deliveryInfo, setDeliveryInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    street: '',
    city: '',
    state: '',
    zip: '',
    country: '',
    phone: '',
  });

  const [paymentMethod, setPaymentMethod] = useState('online');
  const [loading, setLoading] = useState(false);
  const [orderItems, setOrderItems] = useState([]);
  const [merchantId, setMerchantId] = useState(merchantIdFromState || '');
  const [userId, setUserId] = useState('');

  // Extract userId from JWT token
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserId(decoded.id || decoded.userId);
      } catch (err) {
        console.error('Failed to decode JWT token:', err);
      }
    }
  }, []);

  // Build order items from cart
  useEffect(() => {
    if (!cartItems) return;

    const items = Object.entries(cartItems)
      .filter(([_, qty]) => qty > 0)
      .map(([id, qty]) => {
        const product = grocery_list.find((p) => String(p._id) === String(id));
        return {
          productId: id, // <-- must match backend schema
          name: product?.name || 'Unknown',
          price: product?.price ? Number(product.price.toString().replace(/,/g, '')) : 0,
          quantity: qty,
          merchantId: product?.merchantId || merchantIdFromState,
        };
      });

    setOrderItems(items);

    // Auto-detect merchantId from first item if not set
    if (!merchantId && items.length > 0) {
      setMerchantId(items[0].merchantId || '');
    }
  }, [cartItems, grocery_list, merchantId, merchantIdFromState]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDeliveryInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handlePaymentMethodChange = (e) => setPaymentMethod(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!orderItems.length) return alert('Your cart is empty.');
    if (!merchantId) return alert('No merchant found for cart items.');
    if (!userId) return alert('Please login to proceed.');

    setLoading(true);

    try {
      const token = localStorage.getItem('token');

      // Convert address object to string
      const addressString = `${deliveryInfo.firstName} ${deliveryInfo.lastName}, ${deliveryInfo.street}, ${deliveryInfo.city}, ${deliveryInfo.state}, ${deliveryInfo.zip}, ${deliveryInfo.country}, Phone: ${deliveryInfo.phone}`;

      const response = await axios.post(
        `${url}/api/order/place`,
        {
          userId,
          items: orderItems, // already has productId
          address: addressString,
          email: deliveryInfo.email,
          paymentMethod,
          merchantId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log('Order Response:', response.data);

      if (response.data.success) {
        if (response.data.payment_url) {
          window.location.href = response.data.payment_url;
        } else if (response.data.virtualAccount) {
          alert(`Please pay via bank transfer:\n${JSON.stringify(response.data.virtualAccount, null, 2)}`);
          navigate('/');
        } else if (response.data.terminalResponse) {
          alert(`Payment sent to terminal:\n${JSON.stringify(response.data.terminalResponse, null, 2)}`);
          navigate('/');
        }
      } else {
        alert(response.data.message || 'Failed to place order');
      }
    } catch (err) {
      console.error('Order API Error:', err.response?.data || err.message);
      alert('Failed to proceed to payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const totalAmount = orderItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const deliveryFee = totalAmount === 0 ? 0 : 5000;

  return (
    <form className='place-order' onSubmit={handleSubmit}>
      <div className="place-order-left">
        <p className="title">Delivery Information</p>
        <div className="multi-fields">
          <input name="firstName" value={deliveryInfo.firstName} onChange={handleChange} type="text" placeholder='First Name' required />
          <input name="lastName" value={deliveryInfo.lastName} onChange={handleChange} type="text" placeholder='Last Name' required />
        </div>
        <input name="email" value={deliveryInfo.email} onChange={handleChange} type="email" placeholder='Email address' required />
        <input name="street" value={deliveryInfo.street} onChange={handleChange} type="text" placeholder='Street' required />
        <div className="multi-fields">
          <input name="city" value={deliveryInfo.city} onChange={handleChange} type="text" placeholder='City' required />
          <input name="state" value={deliveryInfo.state} onChange={handleChange} type="text" placeholder='State' required />
        </div>
        <div className="multi-fields">
          <input name="zip" value={deliveryInfo.zip} onChange={handleChange} type="text" placeholder='Zip code' required />
          <input name="country" value={deliveryInfo.country} onChange={handleChange} type="text" placeholder='Country' required />
        </div>
        <input name="phone" value={deliveryInfo.phone} onChange={handleChange} type="text" placeholder='Phone' required />
      </div>

      <div className="place-order-right">
        <div className="cart-total">
          <h2>Cart Totals</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>₦{totalAmount.toLocaleString()}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>₦{deliveryFee.toLocaleString()}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>₦{(totalAmount + deliveryFee).toLocaleString()}</b>
            </div>
          </div>

          <div className="payment-methods">
            <p className="title">Select Payment Method</p>
            <label>
              <input type="radio" value="online" checked={paymentMethod === 'online'} onChange={handlePaymentMethodChange} />
              Online Checkout
            </label>
            <label>
              <input type="radio" value="bank_transfer" checked={paymentMethod === 'bank_transfer'} onChange={handlePaymentMethodChange} />
              Bank Transfer on Delivery
            </label>
            <label>
              <input type="radio" value="terminal" checked={paymentMethod === 'terminal'} onChange={handlePaymentMethodChange} />
              Terminal on Delivery
            </label>
          </div>

          <button type="submit" disabled={loading}>
            {loading ? 'Processing...' : 'PROCEED TO PAYMENT'}
          </button>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
