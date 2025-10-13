import mongoose from "mongoose";

const merchantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  contact_phone: { type: String },

  // Categories for merchant type (e.g. groceries, fashion, etc.)
  categories: [{ type: String }],

  // --- Paystack Integration Fields ---
  bank_name: { type: String, required: true },         // e.g. "Access Bank"
  account_number: { type: String, required: true },    // e.g. "0123456789"

  // Either a subaccount OR a split code (depending on the integration type)
  subaccount_code: { type: String },                   // legacy or single payout use
  split_code: { type: String, default: "0" },   // placeholder until verified                     // 🔹 used for marketplace revenue splits

  // Merchant activity and financial info
  isActive: { type: Boolean, default: true },
  percentage_charge: { type: Number, default: 10 },    // Grundy keeps 10%

  dateJoined: { type: Date, default: Date.now },
}, { timestamps: true });

const merchantModel =
  mongoose.models.merchant || mongoose.model("merchant", merchantSchema);

export default merchantModel;
