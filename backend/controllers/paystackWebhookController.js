import crypto from "crypto";
import OrderModel from "../models/orderModel.js"; // Adjust path if needed

export const handlePaystackWebhook = async (req, res) => {
  try {
    // --------- Signature Verification (Commented Out for Testing) ---------
    // Uncomment and configure in production for security
    // ---------------------------------------------------------------------
    // const secret = process.env.PAYSTACK_SECRET_KEY;
    // const hash = crypto
    //   .createHmac("sha512", secret)
    //   .update(JSON.stringify(req.body))
    //   .digest("hex");

    // // Verify that the event came from Paystack
    // if (hash !== req.headers["x-paystack-signature"]) {
    //   return res.status(401).send("Invalid signature");
    // }
// ---------------------------------------------------------------------
    const event = req.body.event;
    const data = req.body.data;

    console.log(`🔔 Paystack Webhook Event: ${event}`);

    if (event === "charge.success") {
      const orderId = data.metadata?.order_id;
      if (orderId) {
        await OrderModel.findByIdAndUpdate(orderId, { status: "Paid" });
        console.log(` Order ${orderId} marked as paid.`);
      }
    }

    // Always return 200 so Paystack knows you received it
    res.sendStatus(200);
  } catch (error) {
    console.error("Webhook Error:", error);
    res.sendStatus(500);
  }
};
