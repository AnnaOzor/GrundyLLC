// controllers/paymentController.js
import MerchantModel from "../models/merchantModel.js";
import OrderModel from "../models/orderModel.js"; // Assuming you have this
import {
  initializePayment,
  assignVirtualAccount,
  simulateTerminalPayment,
} from "../utils/paystack.js";

/**
 * ⚡ Online Checkout Payment
 * Prepaid online via Paystack
 */
export const payOnline = async (req, res) => {
  try {
    const { amount, email, orderId, merchantId } = req.body;

    const merchant = await MerchantModel.findById(merchantId);
    if (!merchant) {
      return res.status(404).json({ success: false, message: "Merchant not found" });
    }

    // Create transaction split: Grundy 10%, Merchant 90%
    const splitDetails = {
      type: "percentage",
      bearer_type: "subaccount",
      bearer_subaccount: merchant.subaccount_code,
      subaccounts: [
        { subaccount: merchant.subaccount_code, share: 90 },
        { subaccount: process.env.GRUNDY_SUBACCOUNT, share: 10 },
      ],
    };

    const data = await initializePayment({ amount, email, orderId, merchant, splitDetails });

    // Optionally, store payment reference in Order
    await OrderModel.findByIdAndUpdate(orderId, {
      payment_reference: data.reference,
      payment_method: "online",
    });

    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("Pay Online Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * ⚡ Bank Transfer on Delivery
 * Assigns a dedicated virtual account per order
 */
export const payByBankTransfer = async (req, res) => {
  try {
    const { email, orderId, merchantId } = req.body;

    const merchant = await MerchantModel.findById(merchantId);
    if (!merchant) {
      return res.status(404).json({ success: false, message: "Merchant not found" });
    }

    const data = await assignVirtualAccount({
      customerEmail: email,
      orderId,
      merchantId,
    });

    // Save virtual account details to order
    await OrderModel.findByIdAndUpdate(orderId, {
      payment_method: "bank_transfer",
      virtual_account: {
        account_number: data.account_number,
        bank_name: data.bank.name,
        account_name: data.account_name,
      },
    });

    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("Bank Transfer Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * ⚡ Terminal Payment
 * Simulated card/contactless payment (for MVP/demo)
 */
export const payByTerminal = async (req, res) => {
  try {
    const { terminalId, amount, orderId, merchantId } = req.body;

    const merchant = await MerchantModel.findById(merchantId);
    if (!merchant) {
      return res.status(404).json({ success: false, message: "Merchant not found" });
    }

    // Simulate payment (replace with real terminal API if available)
    const data = await simulateTerminalPayment({
      terminalId,
      amount,
      orderId,
      merchant,
      splitDetails: {
        type: "percentage",
        bearer_type: "subaccount",
        bearer_subaccount: merchant.subaccount_code,
        subaccounts: [
          { subaccount: merchant.subaccount_code, share: 90 },
          { subaccount: process.env.GRUNDY_SUBACCOUNT, share: 10 },
        ],
      },
    });

    // Save transaction info
    await OrderModel.findByIdAndUpdate(orderId, {
      payment_method: "terminal",
      payment_reference: data.reference,
      status: data.status,
    });

    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("Terminal Payment Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
