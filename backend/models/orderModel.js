import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    merchantId: { type: mongoose.Schema.Types.ObjectId, ref: "merchant" },

    items: [
      {
        productId: { type: String, required: true },
        name: { type: String },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
      },
    ],

    amount: { type: Number, required: true }, // total including deliveryFee
    deliveryFee: { type: Number, default: 5000 }, // new field
    address: { type: String, required: true },

    status: {
      type: String,
      enum: [
        "Processing Groceries",
        "Pending Payment",
        "Paid",
        "Failed",
        "Delivered",
        "Cancelled",
      ],
      default: "Processing Groceries",
    },

    payment_method: {
      type: String,
      enum: ["online", "bank_transfer", "terminal"],
    },
    payment_reference: { type: String },
    paymentChannel: { type: String },
    amountPaid: { type: Number },
    paidAt: { type: Date },

    virtual_account: {
      account_number: String,
      account_name: String,
      bank_name: String,
    },

    payment_verified: { type: Boolean, default: false },

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const orderModel =
  mongoose.models.order || mongoose.model("order", orderSchema);

export default orderModel;
