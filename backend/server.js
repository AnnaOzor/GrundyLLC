// ✅ Load environment variables first
import 'dotenv/config';

import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import groceryRouter from "./routes/groceryRoute.js";
import userRouter from "./routes/userRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";
import merchantRouter from "./routes/merchantRoute.js";
import paymentRoute from "./routes/paymentRoute.js";
import paystackRoute from "./routes/paystackRoute.js"; // webhook route
import path from "path";
import { fileURLToPath } from "url";


const app = express();
const port = process.env.PORT || 4000;

// Connect to DB
connectDB();

// Middleware
app.use(cors());

// JSON parsing for normal API routes
app.use("/api/grocery", express.json(), groceryRouter);
app.use("/api/user", express.json(), userRouter);
app.use("/api/cart", express.json(), cartRouter);
app.use("/api/order", express.json(), orderRouter);
app.use("/api/merchant", express.json(), merchantRouter);
app.use("/api/payment", express.json(), paymentRoute);

// Raw body parsing ONLY for Paystack webhook (required for signature verification)
app.use(
  "/api/paystack",
  express.raw({ type: "application/json" }),
  paystackRoute
);

// Static file serving
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Health check route
app.get("/", (req, res) => {
  res.send("API Working ✅");
});

// Start server
app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});
