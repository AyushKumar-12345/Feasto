import express from "express";
import adminAuth from "../middleware/adminAuth.js";
import authMiddleware from "../middleware/auth.js";
import {
    placeOrder,
    userOrders,
    verifyOrder,
    listOrders,
    updateStatus,
    getTracking,
    startTracking,
    updateRiderLocation,
    stopTracking,
} from "../controllers/orderController.js";

const orderRouter = express.Router();

orderRouter.post("/place", authMiddleware, placeOrder);
orderRouter.post("/verify", authMiddleware, verifyOrder);
orderRouter.post("/userorders", authMiddleware, userOrders);
orderRouter.get("/tracking/:orderId", authMiddleware, getTracking);
orderRouter.get("/list", adminAuth, listOrders);
orderRouter.post("/status", adminAuth, updateStatus);
orderRouter.post("/tracking/start", adminAuth, startTracking);
orderRouter.post("/tracking/location", adminAuth, updateRiderLocation);
orderRouter.post("/tracking/stop", adminAuth, stopTracking);

export default orderRouter;