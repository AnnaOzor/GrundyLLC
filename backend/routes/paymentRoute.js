// routes/paymentRoute.js
import express from "express";
import {
  payOnline,
  payByBankTransfer,
  payByTerminal,
} from "../controllers/paymentController.js";

const router = express.Router();

router.post("/online", payOnline);
router.post("/bank-transfer", payByBankTransfer);
router.post("/terminal", payByTerminal);

export default router;
