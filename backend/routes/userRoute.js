import express from "express";
import { loginUser, registerUser, getAllUsers } from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.get("/all", getAllUsers); // ← new route to fetch all users

export default userRouter;
