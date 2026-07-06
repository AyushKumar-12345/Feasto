import UserModel from "../models/userModel.js";

const addToCart = async (req, res) => {
    try {
        const { userId, itemId } = req.body;

        if (!userId || !itemId) {
            return res.status(400).json({
                success: false,
                message: "User ID and Item ID are required",
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
        const { userId, itemId } = req.body;

        if (!userId || !itemId) {
            return res.status(400).json({
                success: false,
                message: "User ID and Item ID are required",
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
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID is required",
            });
        }

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

export { addToCart, removeFromCart, getCart };