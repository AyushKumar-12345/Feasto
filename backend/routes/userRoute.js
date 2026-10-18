import express from "express";

import {
    loginUser,
    registerUser,
} from "../controllers/userController.js";
import authRateLimit from "../middleware/authRateLimit.js";

const userRouter = express.Router();

userRouter.post("/login", authRateLimit, loginUser);
userRouter.post("/register", authRateLimit, registerUser);

export default userRouter;