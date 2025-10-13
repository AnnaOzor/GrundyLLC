import mongoose from "mongoose";

const grocerySchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    merchantId: { type: mongoose.Schema.Types.ObjectId, ref: "merchant", required: true } // new field
});

const groceryModel = mongoose.models.grocery || mongoose.model("grocery", grocerySchema);

export default groceryModel;