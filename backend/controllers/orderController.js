import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import merchantModel from "../models/merchantModel.js";
import {
  initializePayment,
  assignVirtualAccount,
  simulateTerminalPayment,
} from "../utils/paystack.js";

// 🛒 PLACE ORDER
export const placeOrder = async (req, res) => {
  try {
    console.log("🚀 placeOrder body:", req.body);

    const { userId, items, address, email, paymentMethod, merchantId, terminalId } = req.body;

    // Validate request
    if (!userId) return res.status(400).json({ success: false, message: "User ID is required." });
    if (!items || !items.length) return res.status(400).json({ success: false, message: "Order items are required." });
    if (!address) return res.status(400).json({ success: false, message: "Delivery address is required." });
    if (!email) return res.status(400).json({ success: false, message: "Email is required." });
    if (!paymentMethod) return res.status(400).json({ success: false, message: "Payment method is required." });
    if (!merchantId) return res.status(400).json({ success: false, message: "Merchant ID is required." });

    // Validate user
    const user = await userModel.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found." });

    // Validate merchant
    const merchant = await merchantModel.findById(merchantId);
    if (!merchant) return res.status(404).json({ success: false, message: "Merchant not found." });

    // Validate items
    for (const item of items) {
      if (!item.price || !item.quantity) {
        console.error("Invalid order item:", item);
        return res.status(400).json({ success: false, message: "Invalid item data." });
      }
    }

    // Calculate totals
    const itemTotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const deliveryFee = 5000;
    const totalAmount = itemTotal + deliveryFee;

    // Create order
    const newOrder = new orderModel({
      userId,
      merchantId,
      items,
      deliveryFee,
      amount: totalAmount,
      address,
      payment_method: paymentMethod,
      status: "Processing Groceries",
    });
    await newOrder.save();

    // Clear user's cart
    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    const splitDetails = merchant.split_code ? { split_code: merchant.split_code } : null;
    let paymentResponse;

    switch (paymentMethod) {
      case "online":
        paymentResponse = await initializePayment({
          amount: totalAmount * 100,
          email,
          orderId: newOrder._id,
          merchant,
          splitDetails,
        });

        return res.status(201).json({
          success: true,
          message: "Payment link generated successfully",
          payment_url: paymentResponse.authorization_url,
          reference: paymentResponse.reference,
          orderId: newOrder._id,
        });

      case "bank_transfer":
        paymentResponse = await assignVirtualAccount({ customerEmail: email });
        newOrder.virtual_account = paymentResponse;
        await newOrder.save();

        return res.status(201).json({
          success: true,
          message: "Virtual account created for on-delivery payment",
          virtualAccount: paymentResponse,
          orderId: newOrder._id,
        });

      case "terminal":
        if (!terminalId) {
          return res.status(400).json({ success: false, message: "Terminal ID required for terminal payments." });
        }
        paymentResponse = await simulateTerminalPayment({
          terminalId,
          amount: totalAmount * 100,
          orderId: newOrder._id,
          merchant,
          splitDetails,
        });

        return res.status(201).json({
          success: true,
          message: "Payment request sent to rider’s terminal (simulated)",
          terminalResponse: paymentResponse,
          orderId: newOrder._id,
        });

      default:
        return res.status(400).json({
          success: false,
          message: "Invalid payment method. Must be one of: online, bank_transfer, terminal.",
        });
    }
  } catch (error) {
    console.error(" Full Error placing order:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

// 📋 GET USER ORDERS
export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id; // from authMiddleware

    const orders = await orderModel
      .find({ userId })
      .populate("merchantId", "businessName email") // optional: show merchant info
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error("Error fetching user orders:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch user orders",
    });
  }
};
