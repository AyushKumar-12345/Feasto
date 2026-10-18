import express from "express";
import { loginAdmin } from "../controllers/adminController.js";
import authRateLimit from "../middleware/authRateLimit.js";

const adminRouter = express.Router();

adminRouter.post("/login", authRateLimit, loginAdmin);

export default adminRouter;