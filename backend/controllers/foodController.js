import FoodModel from "../models/foodModel.js";
import cloudinary from "../config/cloudinary.js";

const addFood = async (req, res) => {
    try {
        const { name, description, price, category } = req.body;

        if (!name || !description || !price || !category) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Image is required",
            });
        }

        const food = new FoodModel({
            name,
            description,
            price,
            category,
            image: req.file.path,
        });

        await food.save();

        return res.status(201).json({
            success: true,
            message: "Food Added",
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

const listFood = async (req, res) => {
    try {
        const foods = await FoodModel.find({});

        return res.status(200).json({
            success: true,
            data: foods,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

const removeFood = async (req, res) => {
    try {
        const { id } = req.body;

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Food ID is required",
            });
        }

        const food = await FoodModel.findById(id);

        if (!food) {
            return res.status(404).json({
                success: false,
                message: "Food not found",
            });
        }

        if (food.image) {
            const match = food.image.match(/\/upload\/(?:v\d+\/)?(.+)\.[^.]+$/);

            if (match) {
                await cloudinary.uploader.destroy(match[1]);
            }
        }

        await FoodModel.findByIdAndDelete(id);

        return res.status(200).json({
            success: true,
            message: "Food Removed",
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

export { addFood, listFood, removeFood };