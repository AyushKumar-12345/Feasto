import crypto from "crypto";
import razorpay from "../config/razorpay.js";
import OrderModel from "../models/orderModel.js";
import UserModel from "../models/userModel.js";

const placeOrder = async (req, res) => {
    try {
        const { userId, items, amount, address } = req.body;

        const user = await UserModel.findById(userId);

        if (!user) {
            return res.json({
                success: false,
                message: "User not found",
            });
        }

        if (!items || items.length === 0) {
            return res.json({
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

        const options = {
            amount: Number(amount) * 100,
            currency: "INR",
            receipt: newOrder._id.toString(),
        };

        const razorpayOrder = await razorpay.orders.create(options);

        return res.json({
            success: true,
            order: razorpayOrder,
            orderId: newOrder._id,
        });
    } catch (error) {
        console.error(error);

        return res.json({
            success: false,
            message: error.message,
        });
    }
};

const verifyOrder = async (req, res) => {
    const {
        orderId,
        success,
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
    } = req.body;

    try {
        const order = await OrderModel.findById(orderId);

        if (!order) {
            return res.json({
                success: false,
                message: "Order not found",
            });
        }

        if (
            (success === true || success === "true") &&
            razorpay_order_id &&
            razorpay_payment_id &&
            razorpay_signature
        ) {
            const sign = `${razorpay_order_id}|${razorpay_payment_id}`;

            const expectedSign = crypto
                .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
                .update(sign)
                .digest("hex");

            if (razorpay_signature === expectedSign) {
                await OrderModel.findByIdAndUpdate(orderId, {
                    payment: true,
                    paymentId: razorpay_payment_id,
                    paymentMethod: "Razorpay",
                    paymentStatus: "Paid",
                });

                await UserModel.findByIdAndUpdate(order.userId, {
                    cartData: {},
                });

                return res.json({
                    success: true,
                    message: "Paid",
                });
            }

            return res.json({
                success: false,
                message: "Payment verification failed.",
            });
        }

        await OrderModel.findByIdAndDelete(orderId);

        return res.json({
            success: false,
            message: "Not Paid",
        });
    } catch (error) {
        console.error(error);

        return res.json({
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
            return res.json({
                success: false,
                message: "User not found",
            });
        }

        const orders = await OrderModel.find({
            userId: userId,
        });

        return res.json({
            success: true,
            data: orders,
        });
    } catch (error) {
        console.error(error);

        return res.json({
            success: false,
            message: error.message,
        });
    }
};

const listOrders = async (req, res) => {
    try {
        const orders = await OrderModel.find({});

        return res.json({
            success: true,
            data: orders,
        });
    } catch (error) {
        console.error(error);

        return res.json({
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
            return res.json({
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

        return res.json({
            success: true,
            message: "Status Updated",
        });
    } catch (error) {
        console.error(error);

        return res.json({
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