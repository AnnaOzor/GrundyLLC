// import express from 'express';
// import Admin from '../models/Admin.js';
// import jwt from 'jsonwebtoken';

// const router = express.Router();

// // Admin login
// router.post('/login', async (req, res) => {
//   const { email, password } = req.body;
//   const admin = await Admin.findOne({ email });
//   if (!admin) return res.status(401).json({ success: false, message: "Admin not found" });

//   const isMatch = await admin.comparePassword(password);
//   if (!isMatch) return res.status(401).json({ success: false, message: "Incorrect password" });

//   const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
//   res.json({ success: true, token });
// });

// export default router;
