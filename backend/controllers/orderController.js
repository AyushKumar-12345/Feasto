import crypto from "crypto";
import validator from "validator";
import razorpay from "../config/razorpay.js";
import FoodModel from "../models/foodModel.js";
import OrderModel from "../models/orderModel.js";
import UserModel from "../models/userModel.js";

const isValidOrderId = (orderId) =>
    typeof orderId === "string" && /^[a-f\d]{24}$/i.test(orderId);

const placeOrder = async (req, res) => {
    try {
        const userId = req.authenticatedUserId;
        const { items, address, deliveryLocation } = req.body;

        if (!Array.isArray(items) || items.length === 0 || !address || typeof address !== "object" || Array.isArray(address)) {
            return res.status(400).json({
                success: false,
                message: "A non-empty cart and delivery address are required.",
            });
        }

        if (items.length > 20) {
            return res.status(400).json({
                success: false,
                message: "An order can contain no more than 20 different menu items.",
            });
        }

        const addressFields = [
            "firstName",
            "lastName",
            "email",
            "street",
            "city",
            "state",
            "zipCode",
            "country",
            "phone",
        ];
        const cleanAddress = {};
        for (const field of addressFields) {
            const value = address[field];
            if (typeof value !== "string" || !value.trim() || value.trim().length > 200) {
                return res.status(400).json({
                    success: false,
                    message: `A valid ${field} is required.`,
                });
            }
            cleanAddress[field] = value.trim();
        }
        if (!validator.isEmail(cleanAddress.email) || cleanAddress.phone.length < 7) {
            return res.status(400).json({
                success: false,
                message: "Please provide a valid email address and phone number.",
            });
        }

        const seenItemIds = new Set();
        for (const item of items) {
            if (
                !item ||
                typeof item._id !== "string" ||
                !/^[a-f\d]{24}$/i.test(item._id) ||
                !Number.isInteger(item.quantity) ||
                item.quantity < 1 ||
                item.quantity > 99 ||
                seenItemIds.has(item._id)
            ) {
                return res.status(400).json({
                    success: false,
                    message: "The cart contains an invalid item or quantity.",
                });
            }
            item._id = item._id.toLowerCase();
            seenItemIds.add(item._id);
        }

        const menuItems = await FoodModel.find({
            _id: { $in: [...seenItemIds] },
        }).select("name description price category image");
        if (menuItems.length !== seenItemIds.size) {
            return res.status(400).json({
                success: false,
                message: "The cart contains a menu item that is no longer available.",
            });
        }

        const quantityById = new Map(
            items.map((item) => [item._id, item.quantity])
        );
        const orderItems = menuItems.map((item) => ({
            _id: item._id,
            name: item.name,
            description: item.description,
            price: item.price,
            category: item.category,
            image: item.image,
            quantity: quantityById.get(String(item._id)),
        }));
        const subtotal = orderItems.reduce(
            (total, item) => total + item.price * item.quantity,
            0
        );
        const amount = Math.round((subtotal + 2) * 100) / 100;

        if (
            deliveryLocation !== undefined &&
            deliveryLocation !== null &&
            (
                typeof deliveryLocation.latitude !== "number" ||
                typeof deliveryLocation.longitude !== "number" ||
                !Number.isFinite(deliveryLocation.latitude) ||
                !Number.isFinite(deliveryLocation.longitude) ||
                deliveryLocation.latitude < -90 ||
                deliveryLocation.latitude > 90 ||
                deliveryLocation.longitude < -180 ||
                deliveryLocation.longitude > 180
            )
        ) {
            return res.status(400).json({
                success: false,
                message: "Delivery coordinates are invalid.",
            });
        }

        const newOrder = new OrderModel({
            userId,
            items: orderItems,
            amount,
            address: cleanAddress,
            deliveryLocation: deliveryLocation || null,
            status: "Pending Payment",
            paymentMethod: "Razorpay",
            paymentStatus: "Pending",
        });

        await newOrder.save();

        const razorpayOrder = await razorpay.orders.create({
            amount: Math.round(Number(amount) * 100),
            currency: "INR",
            receipt: newOrder._id.toString(),
        });

        newOrder.razorpayOrderId = razorpayOrder.id;
        await newOrder.save();

        return res.status(200).json({
            success: true,
            order: razorpayOrder,
            orderId: newOrder._id,
            razorpayKeyId: process.env.RAZORPAY_KEY_ID,
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
        if (!isValidOrderId(orderId)) {
            return res.status(400).json({
                success: false,
                message: "A valid order ID is required.",
            });
        }
        const order = await OrderModel.findOne({
            _id: orderId,
            userId: req.authenticatedUserId,
        });

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found.",
            });
        }

        if (order.paymentStatus === "Paid") {
            return res.status(200).json({
                success: true,
                message: "Payment was already verified.",
            });
        }

        if (success !== true && success !== "true") {
            order.payment = false;
            order.paymentStatus = "Failed";
            order.status = "Cancelled";
            await order.save();

            return res.status(400).json({
                success: false,
                message: "Payment not completed",
            });
        }

        if (
            !process.env.RAZORPAY_KEY_SECRET ||
            typeof razorpay_order_id !== "string" ||
            razorpay_order_id !== order.razorpayOrderId ||
            typeof razorpay_payment_id !== "string" ||
            typeof razorpay_signature !== "string" ||
            !/^[a-f\d]{64}$/i.test(razorpay_signature)
        ) {
            order.payment = false;
            order.paymentStatus = "Failed";
            order.status = "Cancelled";
            await order.save();

            return res.status(400).json({
                success: false,
                message: "Payment verification failed",
            });
        }

        const generatedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest("hex");

        const generatedSignatureBuffer = Buffer.from(generatedSignature, "hex");
        const suppliedSignatureBuffer = Buffer.from(razorpay_signature, "hex");
        if (
            generatedSignatureBuffer.length !== suppliedSignatureBuffer.length ||
            !crypto.timingSafeEqual(generatedSignatureBuffer, suppliedSignatureBuffer)
        ) {
            order.payment = false;
            order.paymentStatus = "Failed";
            order.status = "Cancelled";
            await order.save();

            return res.status(400).json({
                success: false,
                message: "Payment verification failed",
            });
        }

        order.payment = true;
        order.paymentId = razorpay_payment_id;
        order.razorpayOrderId = razorpay_order_id;
        order.paymentMethod = "Razorpay";
        order.paymentStatus = "Paid";
        order.status = "Food Processing";
        await order.save();

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
        const userId = req.authenticatedUserId;
        const user = await UserModel.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        const orders = await OrderModel.find({
            userId,
            $or: [
                { paymentStatus: { $in: ["Paid", "Failed"] } },
                { status: "Cancelled" },
            ],
        }).sort({ createdAt: -1 });

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
        const orders = await OrderModel.find({
            $or: [
                { paymentStatus: { $in: ["Paid", "Failed"] } },
                { status: "Cancelled" },
            ],
        }).sort({ createdAt: -1 });
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
        const allowedStatuses = [
            "Food Processing",
            "Out for Delivery",
            "Delivered",
        ];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid order status.",
            });
        }

        if (!isValidOrderId(orderId)) {
            return res.status(400).json({
                success: false,
                message: "A valid order ID is required.",
            });
        }

        const order = await OrderModel.findById(orderId).select(
            "paymentStatus status"
        );

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found",
            });
        }

        if (order.paymentStatus !== "Paid") {
            return res.status(400).json({
                success: false,
                message: "Action denied: Only successfully paid orders can be updated.",
            });
        }

        const allowedNextStatuses = {
            "Food Processing": "Out for Delivery",
            "Out for Delivery": "Delivered",
        };
        if (order.status !== status && allowedNextStatuses[order.status] !== status) {
            return res.status(409).json({
                success: false,
                message: "Order status cannot move backwards or skip a delivery step.",
            });
        }
        if (order.status === status) {
            return res.status(200).json({
                success: true,
                message: "Status is already up to date.",
            });
        }

        const statusUpdate = { status };
        if (status !== "Out for Delivery") {
            statusUpdate.trackingActive = false;
            statusUpdate.riderLocation = null;
            statusUpdate.riderLocationUpdatedAt = null;
        }

        const updatedOrder = await OrderModel.findOneAndUpdate(
            {
                _id: orderId,
                paymentStatus: "Paid",
                status: order.status,
            },
            { $set: statusUpdate },
            { new: true }
        );

        if (!updatedOrder) {
            return res.status(409).json({
                success: false,
                message: "Order status changed. Refresh and try again.",
            });
        }

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

const getTracking = async (req, res) => {
    try {
        if (!isValidOrderId(req.params.orderId)) {
            return res.status(400).json({
                success: false,
                message: "A valid order ID is required.",
            });
        }

        const order = await OrderModel.findOne({
            _id: req.params.orderId,
            userId: req.authenticatedUserId,
        }).select(
            "status paymentStatus deliveryLocation riderLocation riderLocationUpdatedAt trackingActive"
        );

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found.",
            });
        }

        const trackingAvailable =
            order.paymentStatus === "Paid" &&
            order.status === "Out for Delivery" &&
            order.trackingActive;

        return res.status(200).json({
            success: true,
            data: {
                status: order.status,
                deliveryLocation: order.deliveryLocation,
                riderLocation: trackingAvailable ? order.riderLocation : null,
                riderLocationUpdatedAt: trackingAvailable
                    ? order.riderLocationUpdatedAt
                    : null,
                trackingActive: trackingAvailable,
            },
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Unable to load delivery tracking.",
        });
    }
};

const startTracking = async (req, res) => {
    try {
        const { orderId } = req.body;
        if (!isValidOrderId(orderId)) {
            return res.status(400).json({
                success: false,
                message: "A valid order ID is required.",
            });
        }

        const order = await OrderModel.findOneAndUpdate(
            {
                _id: orderId,
                paymentStatus: "Paid",
                status: "Out for Delivery",
            },
            {
                $set: {
                    trackingActive: true,
                    riderLocation: null,
                    riderLocationUpdatedAt: null,
                },
            },
            { new: true }
        );

        if (!order) {
            const existingOrder = await OrderModel.findById(orderId).select(
                "paymentStatus status"
            );
            if (existingOrder) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Live tracking can only start for paid orders out for delivery.",
                });
            }

            return res.status(404).json({
                success: false,
                message: "Order not found.",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Live tracking started.",
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Unable to start live tracking.",
        });
    }
};

const updateRiderLocation = async (req, res) => {
    try {
        const { orderId, latitude, longitude } = req.body;

        if (!isValidOrderId(orderId)) {
            return res.status(400).json({
                success: false,
                message: "A valid order ID is required.",
            });
        }

        if (
            typeof latitude !== "number" ||
            typeof longitude !== "number" ||
            !Number.isFinite(latitude) ||
            !Number.isFinite(longitude) ||
            latitude < -90 ||
            latitude > 90 ||
            longitude < -180 ||
            longitude > 180
        ) {
            return res.status(400).json({
                success: false,
                message: "Rider coordinates are invalid.",
            });
        }

        const result = await OrderModel.updateOne(
            {
                _id: orderId,
                paymentStatus: "Paid",
                status: "Out for Delivery",
                trackingActive: true,
            },
            {
                $set: {
                    riderLocation: { latitude, longitude },
                    riderLocationUpdatedAt: new Date(),
                },
            }
        );

        if (result.matchedCount === 0) {
            const order = await OrderModel.findById(orderId).select("_id");
            if (order) {
                return res.status(409).json({
                    success: false,
                    message: "Live tracking is not active for this order.",
                });
            }

            return res.status(404).json({
                success: false,
                message: "Order not found.",
            });
        }

        return res.status(200).json({
            success: true,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Unable to update rider location.",
        });
    }
};

const stopTracking = async (req, res) => {
    try {
        if (!isValidOrderId(req.body.orderId)) {
            return res.status(400).json({
                success: false,
                message: "A valid order ID is required.",
            });
        }

        const order = await OrderModel.findByIdAndUpdate(
            req.body.orderId,
            {
                $set: {
                    trackingActive: false,
                    riderLocation: null,
                    riderLocationUpdatedAt: null,
                },
            },
            { new: true }
        );

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found.",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Live tracking stopped.",
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Unable to stop live tracking.",
        });
    }
};

export {
    placeOrder,
    verifyOrder,
    userOrders,
    listOrders,
    updateStatus,
    getTracking,
    startTracking,
    updateRiderLocation,
    stopTracking,
};