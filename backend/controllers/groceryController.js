import groceryModel from "../models/groceryModel.js";
import fs from "fs";

/* ============================================================
   ADD GROCERY (Merchant Only)
   ============================================================ */
const addGrocery = async (req, res) => {
  try {
    const image_filename = req.file ? req.file.filename : null;
    const merchantId = req.merchantId;

    const grocery = new groceryModel({
      name: req.body.name,
      price: req.body.price,
      image: image_filename,
      category: req.body.category,
      description: req.body.description,
      merchantId,
    });

    await grocery.save();
    res.json({ success: true, message: "Grocery Added", data: grocery });
  } catch (error) {
    console.error("🚨 Error in addGrocery:", error);
    res.json({ success: false, message: "Error adding grocery" });
  }
};

/* ============================================================
    LIST GROCERIES (Authenticated Merchant)
   ============================================================ */
const listGrocery = async (req, res) => {
  try {
    const merchantId = req.merchantId;
    const groceries = await groceryModel.find({ merchantId });
    res.json({ success: true, data: groceries });
  } catch (error) {
    console.error("🚨 Error in listGrocery:", error);
    res.json({ success: false, message: "Error fetching groceries" });
  }
};

/* ============================================================
    REMOVE GROCERY (Merchant Only)
   ============================================================ */
const removeGrocery = async (req, res) => {
  try {
    const grocery = await groceryModel.findById(req.body.id);
    if (!grocery)
      return res.json({ success: false, message: "Grocery not found" });

    if (grocery.merchantId.toString() !== req.merchantId) {
      return res
        .status(403)
        .json({ success: false, message: "Unauthorized to delete this grocery" });
    }

    // Delete image file if it exists
    const imagePath = `uploads/${grocery.image}`;
    if (grocery.image && fs.existsSync(imagePath)) fs.unlinkSync(imagePath);

    await groceryModel.findByIdAndDelete(req.body.id);
    res.json({ success: true, message: "Grocery Removed" });
  } catch (error) {
    console.error("🚨 Error in removeGrocery:", error);
    res.json({ success: false, message: "Error removing grocery" });
  }
};

/* ============================================================
    EDIT GROCERY (Merchant Only)
   ============================================================ */
const editGrocery = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, category, description } = req.body;

    const grocery = await groceryModel.findById(id);
    if (!grocery)
      return res.json({ success: false, message: "Grocery not found" });

    if (grocery.merchantId.toString() !== req.merchantId) {
      return res
        .status(403)
        .json({ success: false, message: "Unauthorized to edit this grocery" });
    }

    // Handle image update
    if (req.file) {
      const oldImagePath = `uploads/${grocery.image}`;
      if (grocery.image && fs.existsSync(oldImagePath)) fs.unlinkSync(oldImagePath);
      grocery.image = req.file.filename;
    }

    // Update editable fields
    if (name) grocery.name = name;
    if (price !== undefined) grocery.price = Number(price);
    if (category) grocery.category = category;
    if (description) grocery.description = description;

    await grocery.save();
    res.json({ success: true, message: "Grocery updated successfully", data: grocery });
  } catch (error) {
    console.error("🚨 Error in editGrocery:", error);
    res.json({ success: false, message: "Error updating grocery" });
  }
};

/* ============================================================
    LIST PUBLIC GROCERIES (No Auth)
   ============================================================ */
const listPublicGroceries = async (req, res) => {
  try {
    const groceries = await groceryModel.find({});
    res.json({ success: true, data: groceries });
  } catch (error) {
    console.error("🚨 Error in listPublicGroceries:", error);
    res.json({ success: false, message: "Error fetching groceries" });
  }
};

export {
  addGrocery,
  listGrocery,
  removeGrocery,
  editGrocery,
  listPublicGroceries,
};
