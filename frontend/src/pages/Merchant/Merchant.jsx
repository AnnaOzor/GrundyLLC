import React from "react";
import { Link } from "react-router-dom";
import { merchant_list } from "../../assets/assets";
import "./Merchant.css";

const Merchant = () => {
  return (
    <section className="merchant-section">
      <h2 className="section-title">Our Trusted Merchants</h2>
      <p className="section-subtitle">
        Meet our verified local suppliers bringing you fresh produce, pantry essentials, and quality groceries every day.
      </p>

      <div className="merchant-grid">
        {merchant_list.map((merchant) => (
          <div key={merchant._id} className="merchant-card-wrapper">
            {/* Card content clickable */}
            <Link to={`/merchants/${merchant._id}`} className="merchant-link">
              <div className="merchant-card">
                <div className="merchant-header">
                  <div className="merchant-icon">
                    <img
                      src="https://cdn-icons-png.flaticon.com/512/869/869636.png"
                      alt="merchant"
                    />
                  </div>
                  <div className="merchant-info">
                    <h3 className="merchant-name">{merchant.name}</h3>
                    <p className="merchant-category">{merchant.category}</p>
                  </div>
                </div>
                <p className="merchant-description">{merchant.description}</p>
              </div>
            </Link>

            {/* Footer outside Link */}
            <div className="merchant-footer">
              <span
                className="merchant-email"
                onClick={(e) => {
                  e.stopPropagation();
                  window.location.href = `mailto:${merchant.contact_email}`;
                }}
              >
                {merchant.contact_email}
              </span>
              <p className="merchant-phone">{merchant.contact_phone}</p>
              <p className="merchant-split">
                Split Code: <span>{merchant.split_code}</span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Merchant;