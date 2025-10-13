import React, { useContext } from 'react';
import './Cart.css';
import { StoreContext } from '../../context/StoreContext';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const { cartItems, grocery_list, addToCart, removeFromCart, getTotalCartAmount, url } = useContext(StoreContext);
  const navigate = useNavigate();

  const cartHasItems = Object.values(cartItems).some(qty => qty > 0);

  // Get merchantId from cart items (assuming all items from same merchant)
  const cartMerchantIds = Object.entries(cartItems)
    .filter(([_, qty]) => qty > 0)
    .map(([id, _]) => {
      const product = grocery_list.find(p => String(p._id) === String(id));
      return product?.merchantId;
    })
    .filter(Boolean);

  const merchantId = [...new Set(cartMerchantIds)][0] || ''; // first merchantId

  const handleProceedToCheckout = () => {
    if (!cartHasItems) return alert('Your cart is empty.');
    if (!merchantId) return alert('No merchant found for cart items.');

    // Pass cart and merchantId via state to order page
    navigate('/order', {
      state: {
        merchantId,
        cartItems,
      },
    });
  };

  return (
    <div className="cart">
      <div className="cart-items">
        <div className="cart-items-title">
          <p>Items</p>
          <p>Title</p>
          <p>Price</p>
          <p>Quantity</p>
          <p>Total</p>
          <p>Action</p>
        </div>
        <br />
        <hr />

        {!cartHasItems && <p>Your cart is empty.</p>}

        {Object.entries(cartItems).map(([id, qty]) => {
          if (qty <= 0) return null;

          const product = grocery_list.find(p => String(p._id) === String(id));
          if (!product) return null;

          const price = typeof product.price === 'string'
            ? Number(product.price.replace(/,/g, ''))
            : Number(product.price);

          return (
            <div key={id}>
              <div className="cart-items-title cart-items-item">
                <img src={`${url}/uploads/${product.image}`} alt={product.name} />
                <p>{product.name}</p>
                <p>₦{Number(product.price).toLocaleString()}</p>

                {/* Quantity counter */}
                <div className="cart-quantity-control">
                  <button onClick={() => removeFromCart(id)}>-</button>
                  <span>{qty}</span>
                  <button onClick={() => addToCart(id)}>+</button>
                </div>

                <p>₦{(price * qty).toLocaleString()}</p>

                {/* Delete button */}
                <button
                  className="cart-delete-btn"
                  onClick={() => removeFromCart(id, true)}
                >
                  Delete
                </button>
              </div>
              <hr />
            </div>
          );
        })}
      </div>

      <div className="cart-bottom">
        <div className="cart-total">
          <h2>Cart Totals</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>₦{getTotalCartAmount().toLocaleString()}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>₦{(getTotalCartAmount() === 0 ? 0 : 5000).toLocaleString()}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>₦{(getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 5000).toLocaleString()}</b>
            </div>
          </div>
          <button onClick={handleProceedToCheckout}>PROCEED TO CHECKOUT</button>
        </div>

        <div className="cart-promocode">
          <div>
            <p>Have a promo code? Enter it here</p>
            <div className="cart-promocode-input">
              <input type="text" placeholder="Enter promo code" />
              <button>Submit</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
