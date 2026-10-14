import express from "express";
import adminAuth from "../middleware/adminAuth.js";
import authMiddleware from "../middleware/auth.js";
import {
    placeOrder,
    userOrders,
    verifyOrder,
    listOrders,
    updateStatus,
} from "../controllers/orderController.js";

const orderRouter = express.Router();

orderRouter.post("/place", authMiddleware, placeOrder);
orderRouter.post("/verify", authMiddleware, verifyOrder);
orderRouter.post("/userorders", authMiddleware, userOrders);
orderRouter.get("/list", adminAuth, listOrders);
orderRouter.post("/status", adminAuth, updateStatus);

export default orderRouter;