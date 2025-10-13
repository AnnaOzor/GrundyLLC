import jwt from "jsonwebtoken";
import Merchant from "../models/merchantModel.js";

const merchantAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || req.headers.token;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided.",
      });
    }

    // Extract token
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : authHeader;

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Validate merchant exists
    const merchant = await Merchant.findById(decoded.id).select("-password");
    if (!merchant) {
      return res.status(404).json({
        success: false,
        message: "Merchant not found or account inactive.",
      });
    }

    // Attach merchant details to request
    req.merchant = merchant;
    req.merchantId = merchant._id;

    next();
  } catch (error) {
    console.error("Merchant Auth Error:", error.message);
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token. Please log in again.",
    });
  }
};

export default merchantAuth;
