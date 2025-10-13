import React from "react";
import { useParams } from "react-router-dom";
import { merchant_list, grocery_list } from "../../assets/assets";
import "./Merchant.css";

const MerchantDetail = () => {
  const { id } = useParams();
  const merchant = merchant_list.find((m) => m._id === id);

  if (!merchant) {
    return <p className="merchant-not-found">Merchant not found</p>;
  }

  // Filter products that belong to this merchant
  const merchantProducts = grocery_list.filter(
    (item) => item.merchant_id === merchant._id
  );

  return (
    <section className="merchant-detail">
      <div className="merchant-header">
        <h2>{merchant.name}</h2>
        <p>{merchant.description}</p>
        <p>
          Category: <strong>{merchant.category}</strong>
        </p>
        <p>
          Email:{" "}
          <a href={`mailto:${merchant.contact_email}`}>{merchant.contact_email}</a>
        </p>
        <p>
          Phone:{" "}
          <a href={`tel:${merchant.contact_phone}`}>{merchant.contact_phone}</a>
        </p>
        <p>
          Split Code: <span>{merchant.split_code}</span>
        </p>
      </div>

      <h3 className="product-list-title">Available Stock</h3>

      <div className="product-grid">
        {merchantProducts.length > 0 ? (
          merchantProducts.map((product) => (
            <div key={product._id} className="product-card">
              <div className="product-image-wrapper">
                <img src={product.image} alt={product.name} />
                <span className="product-stock">
                  {product.stock || "N/A"}
                </span>
              </div>
              <h4>{product.name}</h4>
              <p>₦{product.price}</p>
            </div>
          ))
        ) : (
          <p>This merchant hasn’t added any products yet.</p>
        )}
      </div>
    </section>
  );
};

export default MerchantDetail;