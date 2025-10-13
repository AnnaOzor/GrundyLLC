import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Merchant.css";

const categoriesList = [
    "Fresh Produce", "Fruits", "Roots and Tubers",
    "Grains and Staple Foods", "Proteins",
    "Oils and Spices", "Packaged Foods and Beverages",
    "Household Essentials"
];

const MerchantSignup = ({ url }) => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        contact_phone: "",
        categories: []
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (type === "checkbox") {
            setFormData(prev => ({
                ...prev,
                categories: checked
                    ? [...prev.categories, value]
                    : prev.categories.filter(cat => cat !== value)
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${url}/api/merchant/signup`, formData);
            if (response.data.success) {
                toast.success("Signup successful! Please login.");
                navigate("/merchant/login");
            } else {
                toast.error(response.data.message || "Signup failed");
            }
        } catch (error) {
            toast.error("Server error during signup");
        }
    };

    return (
        <div className="merchant-signup">
            <h2>Merchant Signup</h2>
            <form onSubmit={handleSubmit} className="signup-form">
                <label>Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required />

                <label>Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required />

                <label>Password</label>
                <input type="password" name="password" value={formData.password} onChange={handleChange} required />

                <label>Phone</label>
                <input type="text" name="contact_phone" value={formData.contact_phone} onChange={handleChange} required />

                <label>Vendor Categories</label>
                <div className="categories-checkboxes">
                    {categoriesList.map(cat => (
                        <label key={cat}>
                            <input
                                type="checkbox"
                                name="categories"
                                value={cat}
                                checked={formData.categories.includes(cat)}
                                onChange={handleChange}
                            />
                            {cat}
                        </label>
                    ))}
                </div>

                <div className="terms-container">
                    <input
                        type="checkbox"
                        id="terms"
                        required
                    />
                    <label htmlFor="terms">
                        I agree to the <a href="/terms" target="_blank" rel="noopener noreferrer">Terms & Conditions</a>
                    </label>
                </div>


                <button type="submit">Signup</button>
            </form>
        </div>
    );
};

export default MerchantSignup;