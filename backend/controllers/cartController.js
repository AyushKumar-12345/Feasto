import mongoose from "mongoose";
import FoodModel from "../models/foodModel.js";
import UserModel from "../models/userModel.js";

const addToCart = async (req, res) => {
    try {
        const userId = req.authenticatedUserId;
        const { itemId } = req.body;

        if (typeof itemId !== "string" || !/^[a-f\d]{24}$/i.test(itemId)) {
            return res.status(400).json({
                success: false,
                message: "A valid menu item ID is required.",
            });
        }

        const itemExists = await FoodModel.exists({ _id: itemId });
        if (!itemExists) {
            return res.status(404).json({
                success: false,
                message: "Menu item not found.",
            });
        }

        const userData = await UserModel.findById(userId);

        if (!userData) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        const cartData = userData.cartData || {};

        if ((cartData[itemId] || 0) >= 99) {
            return res.status(400).json({
                success: false,
                message: "A maximum of 99 of each item can be added.",
            });
        }
        cartData[itemId] = (cartData[itemId] || 0) + 1;

        await UserModel.findByIdAndUpdate(userId, { cartData });

        return res.status(200).json({
            success: true,
            message: "Added To Cart",
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

const removeFromCart = async (req, res) => {
    try {
        const userId = req.authenticatedUserId;
        const { itemId } = req.body;

        if (typeof itemId !== "string" || !mongoose.isValidObjectId(itemId)) {
            return res.status(400).json({
                success: false,
                message: "A valid menu item ID is required.",
            });
        }

        const userData = await UserModel.findById(userId);

        if (!userData) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        const cartData = userData.cartData || {};

        if (cartData[itemId]) {
            cartData[itemId]--;

            if (cartData[itemId] <= 0) {
                delete cartData[itemId];
            }

            await UserModel.findByIdAndUpdate(userId, { cartData });
        }

        return res.status(200).json({
            success: true,
            message: "Removed From Cart",
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

const getCart = async (req, res) => {
    try {
        const userId = req.authenticatedUserId;

        const userData = await UserModel.findById(userId);

        if (!userData) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        return res.status(200).json({
            success: true,
            cartData: userData.cartData || {},
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

const mergeGuestCart = async (req, res) => {
    try {
        const userId = req.authenticatedUserId;
        const { guestCart, mergeId } = req.body || {};

        if (
            !guestCart ||
            typeof guestCart !== "object" ||
            Array.isArray(guestCart) ||
            Object.keys(guestCart).length > 100 ||
            typeof mergeId !== "string" ||
            !/^[\da-f]{8}-[\da-f]{4}-4[\da-f]{3}-[89ab][\da-f]{3}-[\da-f]{12}$/i.test(mergeId)
        ) {
            return res.status(400).json({
                success: false,
                message: "A valid guest cart is required.",
            });
        }

        const entries = Object.entries(guestCart);
        for (const [itemId, quantity] of entries) {
            if (
                !/^[a-f\d]{24}$/i.test(itemId) ||
                !Number.isInteger(quantity) ||
                quantity < 1 ||
                quantity > 99
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Guest cart contains an invalid item or quantity.",
                });
            }

        }

        const userData = await UserModel.findById(userId);
        if (!userData) {
            return res.status(404).json({
                success: false,
                message: "User not found.",
            });
        }

        if (userData.lastGuestCartMergeId === mergeId) {
            return res.status(200).json({
                success: true,
                cartData: userData.cartData || {},
            });
        }

        for (const [itemId] of entries) {
            if (!(await FoodModel.exists({ _id: itemId }))) {
                return res.status(404).json({
                    success: false,
                    message: "A dish in the guest cart is no longer available.",
                });
            }
        }

        const cartData = { ...(userData.cartData || {}) };
        for (const [itemId, quantity] of entries) {
            cartData[itemId] = Math.min(
                99,
                (Number(cartData[itemId]) || 0) + quantity
            );
        }

        const updatedUser = await UserModel.findOneAndUpdate(
            {
                _id: userId,
                lastGuestCartMergeId: { $ne: mergeId },
            },
            {
                $set: {
                    cartData,
                    lastGuestCartMergeId: mergeId,
                },
            },
            { new: true }
        );
        if (!updatedUser) {
            const latestUser = await UserModel.findById(userId);
            if (!latestUser) {
                return res.status(404).json({
                    success: false,
                    message: "User not found.",
                });
            }

            return res.status(200).json({
                success: true,
                cartData: latestUser.cartData || {},
            });
        }

        return res.status(200).json({
            success: true,
            cartData: updatedUser.cartData || cartData,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

export { addToCart, removeFromCart, getCart, mergeGuestCart };