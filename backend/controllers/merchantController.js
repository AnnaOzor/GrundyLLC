import merchantModel from "../models/merchantModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { getBankCode, createSubaccount, createSplit } from "../utils/paystack.js";

// 🔹 Helper: Generate JWT
const createToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

/**
 * =========================================================
 *  REGISTER MERCHANT
 * =========================================================
 */
export const registerMerchant = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      bank_name,
      account_number,
      contact_phone,
      categories,
    } = req.body;

    //  Check if merchant already exists
    const existing = await merchantModel.findOne({ email });
    if (existing) {
      return res
        .status(400)
        .json({ success: false, message: "Merchant already exists" });
    }

    //  Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Resolve bank name to Paystack bank code
    const bankCode = await getBankCode(bank_name);
    if (!bankCode) {
      throw new Error(`Bank not found or unsupported: ${bank_name}`);
    }

    // Create Paystack Subaccount
    const paystackAccount = await createSubaccount({
      business_name: name,
      settlement_bank: bankCode,
      account_number,
      percentage_charge: process.env.PLATFORM_COMMISSION_PERCENT || 10, // Grundy’s share
    });

    if (!paystackAccount?.subaccount_code) {
      throw new Error("Failed to create Paystack subaccount");
    }

    // Create Paystack Split (Merchant + Grundy)
    let splitCode = null;
    try {
      const split = await createSplit(paystackAccount.subaccount_code);
      splitCode = split?.split_code || null;
    } catch (splitErr) {
      console.warn(
        " Split creation failed, continuing with subaccount only:",
        splitErr.message
      );
    }

    // Create Merchant Record
    const newMerchant = await merchantModel.create({
      name,
      email,
      password: hashedPassword,
      contact_phone,
      categories,
      bank_name,
      account_number,
      subaccount_code: paystackAccount.subaccount_code,
    //   split_code: splitCode,
    split_code: "0",
      isActive: true,
      percentage_charge:
        process.env.PLATFORM_COMMISSION_PERCENT || 10, // Grundy’s share
    });

    // Generate JWT
    const token = createToken(newMerchant._id);

    res.status(201).json({
      success: true,
      message: "Merchant registered successfully",
      token,
      merchant: {
        id: newMerchant._id,
        name: newMerchant.name,
        email: newMerchant.email,
        contact_phone: newMerchant.contact_phone,
        subaccount_code: newMerchant.subaccount_code,
        split_code: newMerchant.split_code,
      },
    });
  } catch (error) {
    console.error(
      "Register Merchant Error:",
      error.response?.data || error.message
    );
    res.status(500).json({
      success: false,
      message:
        error.response?.data?.message ||
        error.message ||
        "Error registering merchant",
    });
  }
};

/**
 * =========================================================
 * LOGIN MERCHANT
 * =========================================================
 */
export const loginMerchant = async (req, res) => {
  try {
    const { email, password } = req.body;

    const merchant = await merchantModel.findOne({ email });
    if (!merchant) {
      return res
        .status(404)
        .json({ success: false, message: "Merchant not found" });
    }

    const isMatch = await bcrypt.compare(password, merchant.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    const token = createToken(merchant._id);

    res.json({
      success: true,
      message: "Login successful",
      token,
      merchant: {
        id: merchant._id,
        name: merchant.name,
        email: merchant.email,
        subaccount_code: merchant.subaccount_code,
        split_code: merchant.split_code,
      },
    });
  } catch (error) {
    console.error(" Merchant Login Error:", error);
    res.status(500).json({ success: false, message: "Error logging in" });
  }
};

/**
 * =========================================================
 * GET MERCHANT DASHBOARD
 * =========================================================
 */
export const getMerchantDashboard = async (req, res) => {
  try {
    const merchant = await merchantModel
      .findById(req.userId)
      .select("-password");

    if (!merchant) {
      return res
        .status(404)
        .json({ success: false, message: "Merchant not found" });
    }

    res.json({
      success: true,
      data: {
        name: merchant.name,
        email: merchant.email,
        contact_phone: merchant.contact_phone,
        categories: merchant.categories,
        subaccount_code: merchant.subaccount_code,
        split_code: merchant.split_code || null,
        dateJoined: merchant.createdAt,
      },
    });
  } catch (error) {
    console.error(" Dashboard Error:", error);
    res
      .status(500)
      .json({ success: false, message: "Error fetching merchant dashboard" });
  }
};

/**
 * =========================================================
 *  GET PUBLIC MERCHANT DETAILS
 * =========================================================
 */
export const getMerchantById = async (req, res) => {
  try {
    const merchant = await merchantModel
      .findById(req.params.id)
      .select("-password");

    if (!merchant) {
      return res
        .status(404)
        .json({ success: false, message: "Merchant not found" });
    }

    res.json({ success: true, merchant });
  } catch (error) {
    console.error("Merchant Detail Error:", error);
    res
      .status(500)
      .json({ success: false, message: "Error fetching merchant details" });
  }
};

/**
 * =========================================================
 *  UPDATE MERCHANT PROFILE
 * =========================================================
 */
export const updateMerchant = async (req, res) => {
  try {
    const merchantId = req.userId;
    const updates = req.body;

    const updatedMerchant = await merchantModel
      .findByIdAndUpdate(merchantId, updates, { new: true })
      .select("-password");

    if (!updatedMerchant) {
      return res
        .status(404)
        .json({ success: false, message: "Merchant not found" });
    }

    res.json({
      success: true,
      message: "Merchant profile updated successfully",
      merchant: updatedMerchant,
    });
  } catch (error) {
    console.error(" Update Merchant Error:", error);
    res
      .status(500)
      .json({ success: false, message: "Error updating merchant profile" });
  }
};
