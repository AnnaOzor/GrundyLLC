import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // <-- Import navigate
import './LoginPopup.css';
import { assets } from '../../assets/assets';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';

const LoginPopup = ({ setShowLogin, isMerchant = false }) => {
    const { url, setToken } = useContext(StoreContext);
    const navigate = useNavigate(); // <-- Initialize navigate

    const [currState, setCurrState] = useState('Login'); // 'Login' or 'Sign Up'
    const [data, setData] = useState({ name: '', email: '', password: '' });
    const [loading, setLoading] = useState(false);

    const onChangeHandler = (event) => {
        const { name, value } = event.target;
        setData((prev) => ({ ...prev, [name]: value }));
    };

    const onLogin = async (event) => {
        event.preventDefault();

        // Frontend validation
        if (!data.email || !data.password || (currState === 'Sign Up' && !data.name)) {
            alert('Please fill all required fields');
            return;
        }

        const endpoint = currState === 'Login'
            ? isMerchant ? '/api/merchant/login' : '/api/user/login'
            : isMerchant ? '/api/merchant/register' : '/api/user/register';

        const payload = currState === 'Login'
            ? { email: data.email, password: data.password }
            : { name: data.name, email: data.email, password: data.password };

        console.log("Request URL:", `${url}${endpoint}`);
        console.log("Payload:", payload);

        try {
            setLoading(true);
            const response = await axios.post(`${url}${endpoint}`, payload);

            if (response.data.success) {
                if (isMerchant) {
                    // Clear client login
                    localStorage.removeItem('token');
                    setToken('');

                    // Save merchant login
                    localStorage.setItem('merchantToken', response.data.token);
                    localStorage.setItem('merchantId', response.data.merchant._id);

                    // SPA-friendly navigation instead of window.location.href
                    setToken(response.data.token); // update context
                    navigate('/merchant/dashboard'); 
                } else {
                    // Clear merchant login
                    localStorage.removeItem('merchantToken');
                    localStorage.removeItem('merchantId');

                    // Save client login
                    localStorage.setItem('token', response.data.token);
                    setToken(response.data.token);
                    setShowLogin(false);
                }
            } else {
                alert(response.data.message || 'An error occurred.');
            }
        } catch (err) {
            console.error("Backend error:", err.response?.data || err);
            alert(err.response?.data?.message || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-popup">
            <form onSubmit={onLogin} className="login-popup-container">
                <div className="login-popup-title">
                    <h2>{currState}</h2>
                    <img onClick={() => setShowLogin(false)} src={assets.cross_icon} alt="Close" />
                </div>

                <div className="login-popup-inputs">
                    {currState === 'Sign Up' && (
                        <input
                            name="name"
                            type="text"
                            placeholder="Your name"
                            value={data.name}
                            onChange={onChangeHandler}
                            required
                        />
                    )}
                    <input
                        name="email"
                        type="email"
                        placeholder="Your email"
                        value={data.email}
                        onChange={onChangeHandler}
                        required
                    />
                    <input
                        name="password"
                        type="password"
                        placeholder="Password"
                        value={data.password}
                        onChange={onChangeHandler}
                        required
                    />
                </div>

                <button type="submit" disabled={loading}>
                    {loading ? 'Processing...' : (currState === 'Sign Up' ? 'Create account' : 'Login')}
                </button>

                <div className="login-popup-condition">
                    <input type="checkbox" required />
                    <p>By continuing, I agree to the terms of service and privacy policy.</p>
                </div>

                {currState === 'Login' ? (
                    <p>
                        Create a new account? <span onClick={() => setCurrState('Sign Up')}>Click here</span>
                    </p>
                ) : (
                    <p>
                        Already have an account? <span onClick={() => setCurrState('Login')}>Login here</span>
                    </p>
                )}
            </form>
        </div>
    );
};

export default LoginPopup;
