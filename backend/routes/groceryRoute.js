import express from "express";
import multer from "multer";
import fs from "fs";
import {
  addGrocery,
  listGrocery,
  removeGrocery,
  editGrocery,
  listPublicGroceries,
} from "../controllers/groceryController.js";
import merchantAuth from "../middleware/merchantAuth.js";

const groceryRouter = express.Router();

/**
 * ============================================================
 * FILE UPLOAD CONFIGURATION (Multer)
 * ============================================================
 */

// Ensure uploads directory exists
const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Configure Multer storage engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});

const upload = multer({ storage });

/**
 * ============================================================
 * MERCHANT-PROTECTED ROUTES
 * ============================================================
 */

// Add a new grocery item (Merchant only)
groceryRouter.post("/add", merchantAuth, upload.single("image"), addGrocery);

// List all groceries owned by the authenticated merchant
groceryRouter.get("/list", merchantAuth, listGrocery);

// Remove a grocery item by ID (Merchant only)
groceryRouter.post("/remove", merchantAuth, removeGrocery);

// Edit a grocery item by ID (Merchant only)
groceryRouter.put("/edit/:id", merchantAuth, upload.single("image"), editGrocery);

/**
 * ============================================================
 * PUBLIC ROUTES
 * ============================================================
 */

// Publicly accessible grocery list (for customers)
groceryRouter.get("/public", listPublicGroceries);

export default groceryRouter;
