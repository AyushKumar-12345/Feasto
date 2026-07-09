import crypto from "crypto";
import razorpay from "../config/razorpay.js";
import OrderModel from "../models/orderModel.js";
import UserModel from "../models/userModel.js";

const placeOrder = async (req, res) => {
    try {
        const { userId, items, amount, address } = req.body;

        if (!userId || !items || !amount || !address) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields",
            });
        }

        const user = await UserModel.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Cart is empty",
            });
        }

        const newOrder = new OrderModel({
            userId,
            items,
            amount,
            address,
            paymentMethod: "Razorpay",
            paymentStatus: "Pending",
        });

        await newOrder.save();

        const razorpayOrder = await razorpay.orders.create({
            amount: Math.round(Number(amount) * 100),
            currency: "INR",
            receipt: newOrder._id.toString(),
        });

        return res.status(200).json({
            success: true,
            order: razorpayOrder,
            orderId: newOrder._id,
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const verifyOrder = async (req, res) => {
    try {
        const {
            orderId,
            success,
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
        } = req.body;

        const order = await OrderModel.findById(orderId);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found",
            });
        }

        if (
            success !== true &&
            success !== "true"
        ) {
            return res.status(400).json({
                success: false,
                message: "Payment not completed",
            });
        }

        const generatedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest("hex");

        if (generatedSignature !== razorpay_signature) {
            return res.status(400).json({
                success: false,
                message: "Payment verification failed",
            });
        }

        await OrderModel.findByIdAndUpdate(orderId, {
            payment: true,
            paymentId: razorpay_payment_id,
            paymentMethod: "Razorpay",
            paymentStatus: "Paid",
        });

        await UserModel.findByIdAndUpdate(order.userId, {
            cartData: {},
        });

        return res.status(200).json({
            success: true,
            message: "Payment verified successfully",
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const userOrders = async (req, res) => {
    try {
        const { userId } = req.body;

        const user = await UserModel.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        const orders = await OrderModel.find({ userId });

        return res.status(200).json({
            success: true,
            data: orders,
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const listOrders = async (req, res) => {
    try {
        const orders = await OrderModel.find({});

        return res.status(200).json({
            success: true,
            data: orders,
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const updateStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body;

        const order = await OrderModel.findById(orderId);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found",
            });
        }

        const updateFields = { status };

        if (status === "Delivered") {
            updateFields.payment = true;
            updateFields.paymentStatus = "Paid";
        }

        await OrderModel.findByIdAndUpdate(orderId, updateFields);

        return res.status(200).json({
            success: true,
            message: "Status Updated",
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export {
    placeOrder,
    verifyOrder,
    userOrders,
    listOrders,
    updateStatus,
};