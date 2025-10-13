import userModel from "../models/userModel.js";

// Add item to cart
const addToCart = async (req, res) => {
  try {
    let userData = await userModel.findById(req.userId); // <-- updated
    if (!userData) return res.json({ success: false, message: "User not found" });

    let cartData = userData.cartData || {}; // handle undefined cartData

    if (!cartData[req.body.itemId]) {
      cartData[req.body.itemId] = 1;
    } else {
      cartData[req.body.itemId] += 1;
    }

    await userModel.findByIdAndUpdate(req.userId, { cartData });
    res.json({ success: true, message: "Added To Cart" });
  } catch (error) {
    console.error("Add to Cart Error:", error);
    res.json({ success: false, message: "Error", error: error.message });
  }
};

// Remove item from cart
const removeFromCart = async (req, res) => {
  try {
    let userData = await userModel.findById(req.userId); 
    if (!userData) return res.json({ success: false, message: "User not found" });

    let cartData = userData.cartData || {};

    if (cartData[req.body.itemId] && cartData[req.body.itemId] > 0) {
      cartData[req.body.itemId] -= 1;
    }

    await userModel.findByIdAndUpdate(req.userId, { cartData });
    res.json({ success: true, message: "Removed From Cart" });
  } catch (error) {
    console.error("Remove From Cart Error:", error);
    res.json({ success: false, message: "Error", error: error.message });
  }
};

// Get cart items
const getCartItems = async (req, res) => {
  try {
    let userData = await userModel.findById(req.userId); // <-- updated
    if (!userData) return res.json({ success: false, message: "User not found" });

    let cartData = userData.cartData || {};
    res.json({ success: true, cartData });
  } catch (error) {
    console.error("Get Cart Items Error:", error);
    res.json({ success: false, message: "Error", error: error.message });
  }
};

export { addToCart, removeFromCart, getCartItems };
