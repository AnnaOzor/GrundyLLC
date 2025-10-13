import express from "express";
import axios from "axios";
import { handlePaystackWebhook } from "../controllers/paystackWebhookController.js";

const router = express.Router();

//Verify a Paystack transaction by reference
router.get("/verify/:reference", async (req, res) => {
  const { reference } = req.params;

  try {
    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`, // use your .env secret key
        },
      }
    );

    if (response.data.status && response.data.data.status === "success") {
      return res.json({ status: true, data: response.data.data });
    } else {
      return res.json({ status: false, message: "Transaction not successful" });
    }
  } catch (error) {
    console.error("Error verifying Paystack transaction:", error.message);
    return res.status(500).json({ status: false, message: "Verification failed" });
  }
});

// Webhook route (Paystack sends events here)
router.post("/webhook", handlePaystackWebhook);

export default router;
