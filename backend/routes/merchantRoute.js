import express from "express";
import {
  registerMerchant,
  loginMerchant,
  getMerchantDashboard,
  getMerchantById,
} from "../controllers/merchantController.js";
import merchantAuth from "../middleware/merchantAuth.js";
import merchantModel from "../models/merchantModel.js";

const merchantRouter = express.Router();

merchantRouter.post("/signup", registerMerchant);
merchantRouter.post("/login", loginMerchant);

// === Authenticated Merchant Info ===
merchantRouter.get("/me", merchantAuth, async (req, res) => {
  try {
    res.json({ success: true, merchant: req.merchant });
  } catch (error) {
    res.json({ success: false, message: "Error fetching merchant" });
  }
});

merchantRouter.get("/dashboard", merchantAuth, getMerchantDashboard);


merchantRouter.get("/find", async (req, res) => {
  try {
    const { email, name } = req.query;

    if (!email && !name) {
      return res.json({
        success: false,
        message: "Please provide either email or name to search",
      });
    }


    const query = {};
    if (email) query.email = email;
    if (name) query.name = { $regex: new RegExp(name, "i") }; // case-insensitive

    const merchants = await merchantModel.find(query).select("-password");

    if (!merchants.length) {
      return res.json({ success: false, message: "Merchant not found" });
    }

    res.json({ success: true, merchants });
  } catch (error) {
    console.error("Merchant Lookup Error:", error);
    res.json({ success: false, message: "Error fetching merchant" });
  }
});


merchantRouter.get("/all", async (req, res) => {
  try {
    const merchants = await merchantModel.find().select("-password");
    res.json({ success: true, merchants });
  } catch (error) {
    console.error("Fetch All Merchants Error:", error);
    res.json({ success: false, message: "Error fetching merchants" });
  }
});


merchantRouter.get("/:id", getMerchantById);

export default merchantRouter;
