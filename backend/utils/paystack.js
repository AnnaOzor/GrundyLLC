import axios from "axios";

const PAYSTACK_BASE_URL = "https://api.paystack.co";
const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

// Create a reusable Paystack axios instance
const paystack = axios.create({
  baseURL: PAYSTACK_BASE_URL,
  headers: {
    Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
    "Content-Type": "application/json",
  },
});

/**
 * Get Bank Code by Bank Name
 */
export const getBankCode = async (bankName) => {
  try {
    console.log(`Fetching bank code for: ${bankName}`);
    const res = await paystack.get("/bank");

    const bank = res.data.data.find(
      (b) => b.name.toLowerCase() === bankName.toLowerCase()
    );

    if (!bank) throw new Error(`Bank not found on Paystack: ${bankName}`);
    return bank.code;
  } catch (error) {
    console.error("Paystack Bank Lookup Error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to fetch bank code from Paystack");
  }
};

/**
 * Create Subaccount for Merchant
 */
export const createSubaccount = async ({
  business_name,
  settlement_bank,
  account_number,
  percentage_charge,
}) => {
  try {
    console.log(`Creating Paystack subaccount for: ${business_name}`);

    const response = await paystack.post("/subaccount", {
      business_name,
      settlement_bank,
      account_number,
      percentage_charge,
    });

    return response.data.data;
  } catch (error) {
    console.error("Paystack Subaccount Error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to create Paystack subaccount");
  }
};

/**
 * Create Split (Merchant + Grundy Platform)
 */
export const createSplit = async (merchant_subaccount_code) => {
  try {
    console.log(`Creating Paystack split for: ${merchant_subaccount_code}`);

    const response = await paystack.post("/split", {
      name: `Grundy-Split-${Date.now()}`,
      type: "percentage",
      currency: "NGN",
      subaccounts: [
        { subaccount: merchant_subaccount_code, share: 90 },
        { subaccount: process.env.PLATFORM_SUBACCOUNT_CODE, share: 10 },
      ],
      bearer_type: "account",
      bearer_subaccount: process.env.PLATFORM_SUBACCOUNT_CODE,
    });

    return response.data.data;
  } catch (error) {
    console.error("Paystack Split Error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to create Paystack split");
  }
};

/**
 * Initialize Online Checkout Payment
 */
export const initializePayment = async ({ amount, email, orderId, merchant, splitDetails }) => {
  try {
    console.log(`💳 Initializing Paystack payment for order: ${orderId}`);

    const payload = {
      email,
      amount,
      reference: `ORD-${orderId}-${Date.now()}`,
      callback_url: process.env.PAYSTACK_CALLBACK_URL || `http://localhost:5173/payment-success/${orderId}`,
      metadata: {
        orderId,
        merchantId: merchant._id,
      },
      ...(splitDetails && { split_code: splitDetails.split_code }),
    };

    const response = await paystack.post("/transaction/initialize", payload);
    return response.data.data;
  } catch (error) {
    console.error("Paystack Initialize Payment Error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to initialize payment");
  }
};

/**
 * Assign Virtual Account (Bank Transfer on Delivery)
 *  Correct 2-step flow: Create customer → Assign virtual account
 */

// Assign a dedicated virtual account to a customer for receiving payments
export const assignVirtualAccount = async ({ customerEmail }) => {
  try {
    console.log(`Assigning virtual account for: ${customerEmail}`);

    // Step 1: Create (or retrieve) customer on Paystack
    const customerResponse = await paystack.post("/customer", { email: customerEmail });
    const customerCode = customerResponse.data.data.customer_code;
    console.log("👤 Paystack customer created:", customerCode);

    // Step 2: Assign dedicated virtual account
    const dedicatedResponse = await paystack.post("/dedicated_account/assign", {
      customer: customerCode,
      preferred_bank: "titan-paystack", // or "wema-bank"
    });

    console.log("Virtual account assigned:", dedicatedResponse.data.data);
    return dedicatedResponse.data.data;
  } catch (error) {
    console.error("Paystack Virtual Account Error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to assign virtual account");
  }
};
/* // To test, comment the above assignVirtualAccount()
export const assignVirtualAccount = async ({ customerEmail }) => {
    console.log("[MOCK] Assigning virtual account for:", customerEmail);
    return {
        account_name: "Clara B",
        account_number: "1234567890",
        bank: { name: "Wema Bank" },
    };
};
*/
/**
 * Simulate Terminal Payment (POS on Delivery)
 * Used for testing payment via rider terminal
 */
export const simulateTerminalPayment = async ({ terminalId, amount, orderId, merchant, splitDetails }) => {
  try {
    console.log(`💳 Simulating terminal payment for terminal: ${terminalId}`);

    const response = await paystack.post("/terminal/transaction/simulate", {
      terminal_id: terminalId,
      amount,
      reference: `TERM-${orderId}-${Date.now()}`,
      metadata: {
        orderId,
        merchantId: merchant._id,
      },
      ...(splitDetails && { split_code: splitDetails.split_code }),
    });

    return response.data.data;
  } catch (error) {
    console.error("Paystack Terminal Simulation Error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to simulate terminal payment");
  }
};
