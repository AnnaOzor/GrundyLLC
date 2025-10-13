import React, { useState, useContext } from "react";
import "./Navbar.css";
import { assets } from "../../assets/assets";
import { Link, useNavigate } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";

const Navbar = ({ setShowLogin }) => {
  const [menu, setMenu] = useState("home");
  const [merchantDropdown, setMerchantDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { getTotalCartAmount, token, setToken } = useContext(StoreContext);
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("merchantToken");
    localStorage.removeItem("merchantId");
    setToken("");
    window.location.href = "/";
  };

  return (
    <div className="navbar">
      {/* Logo */}
      <Link to="/" onClick={() => setMobileMenuOpen(false)}>
        <img src={assets.logo} alt="Logo" className="logo" />
      </Link>

      {/* Hamburger (Mobile Only) */}
      <div
        className="hamburger"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      >
        ☰
      </div>

      {/* Main Navigation Menu */}
      <ul className={`navbar-menu ${mobileMenuOpen ? "open" : ""}`}>
        <Link
          to="/"
          onClick={() => {
            setMenu("home");
            setMobileMenuOpen(false);
          }}
          className={menu === "home" ? "active" : ""}
        >
          Home
        </Link>

        <a
          href="#browse-products"
          onClick={() => {
            setMenu("menu");
            setMobileMenuOpen(false);
          }}
          className={menu === "menu" ? "active" : ""}
        >
          Menu
        </a>

        {/* Merchant Dropdown */}
        <li
          className={`merchant-menu ${merchantDropdown ? "open" : ""}`}
          onMouseEnter={() => setMerchantDropdown(true)}
          onMouseLeave={() => setMerchantDropdown(false)}
        >
          <span
            className={menu === "merchants" ? "active" : ""}
            onClick={() => setMenu("merchants")}
          >
            Merchants
          </span>

          <ul className="merchant-dropdown">
            <li>
              <Link to="/merchants" onClick={() => setMobileMenuOpen(false)}>
                All Merchants
              </Link>
            </li>
            <li>
              <Link to="/merchant/login" onClick={() => setMobileMenuOpen(false)}>
                Merchant Login
              </Link>
            </li>
            <li>
              <Link to="/merchant/signup" onClick={() => setMobileMenuOpen(false)}>
                Merchant Signup
              </Link>
            </li>
            <li>
              <Link to="/merchant/dashboard" onClick={() => setMobileMenuOpen(false)}>
                Dashboard
              </Link>
            </li>
          </ul>
        </li>

        <a
          href="#app-download"
          onClick={() => {
            setMenu("mobile-app");
            setMobileMenuOpen(false);
          }}
          className={menu === "mobile-app" ? "active" : ""}
        >
          Mobile App
        </a>

        <a
          href="#footer"
          onClick={() => {
            setMenu("contact-us");
            setMobileMenuOpen(false);
          }}
          className={menu === "contact-us" ? "active" : ""}
        >
          Contact Us
        </a>
      </ul>

      {/* Right-Side Icons */}
      <div className="navbar-right">
        <img src={assets.search_icon} alt="Search" />

        <div className="navbar-search-icon">
          <Link to="/cart" onClick={() => setMobileMenuOpen(false)}>
            <img src={assets.basket_icon} alt="Cart" />
          </Link>
          {getTotalCartAmount() > 0 && <div className="dot"></div>}
        </div>

        {!token ? (
          <button onClick={() => setShowLogin(true)}>Sign In</button>
        ) : (
          <div className="navbar-profile">
            <img src={assets.profile_icon} alt="Profile" />
            <ul className="nav-profile-dropdown">
              <li onClick={() => navigate("/orders")}>
                <img src={assets.bag_icon} alt="Orders" />
                <p>Orders</p>
              </li>
              <hr />
              <li onClick={logout}>
                <img src={assets.logout_icon} alt="Logout" />
                <p>Logout</p>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
