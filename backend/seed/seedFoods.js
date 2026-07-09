import dns from "node:dns";
import "dotenv/config";

dns.setServers(["8.8.8.8", "1.1.1.1"]);

import mongoose from "mongoose";
import cloudinary from "../config/cloudinary.js";
import FoodModel from "../models/foodModel.js";

const foods = [
    { name: "Greek Salad", category: "Salad", price: 12 },
    { name: "Veg Salad", category: "Salad", price: 18 },
    { name: "Clover Salad", category: "Salad", price: 16 },
    { name: "Chicken Salad", category: "Salad", price: 24 },
    { name: "Lasagna Rolls", category: "Rolls", price: 14 },
    { name: "Peri Peri Rolls", category: "Rolls", price: 12 },
    { name: "Chicken Rolls", category: "Rolls", price: 20 },
    { name: "Veg Rolls", category: "Rolls", price: 15 },
    { name: "Ripple Ice Cream", category: "Deserts", price: 14 },
    { name: "Fruit Ice Cream", category: "Deserts", price: 22 },
    { name: "Jar Ice Cream", category: "Deserts", price: 10 },
    { name: "Vanilla Ice Cream", category: "Deserts", price: 12 },
    { name: "Chicken Sandwich", category: "Sandwich", price: 12 },
    { name: "Vegan Sandwich", category: "Sandwich", price: 18 },
    { name: "Grilled Sandwich", category: "Sandwich", price: 16 },
    { name: "Bread Sandwich", category: "Sandwich", price: 24 },
    { name: "Cup Cake", category: "Cake", price: 14 },
    { name: "Vegan Cake", category: "Cake", price: 12 },
    { name: "Butterscotch Cake", category: "Cake", price: 20 },
    { name: "Sliced Cake", category: "Cake", price: 15 },
    { name: "Garlic Mushroom", category: "Pure Veg", price: 14 },
    { name: "Fried Cauliflower", category: "Pure Veg", price: 22 },
    { name: "Mix Veg Pulao", category: "Pure Veg", price: 10 },
    { name: "Rice Zucchini", category: "Pure Veg", price: 12 },
    { name: "Cheese Pasta", category: "Pasta", price: 12 },
    { name: "Tomato Pasta", category: "Pasta", price: 18 },
    { name: "Creamy Pasta", category: "Pasta", price: 16 },
    { name: "Chicken Pasta", category: "Pasta", price: 24 },
    { name: "Butter Noodles", category: "Noodles", price: 14 },
    { name: "Veg Noodles", category: "Noodles", price: 12 },
    { name: "Somen Noodles", category: "Noodles", price: 20 },
    { name: "Cooked Noodles", category: "Noodles", price: 15 }
];

async function seed() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("MongoDB Connected");

        await FoodModel.deleteMany({});
        console.log("Old food data removed.");

        const result = await cloudinary.search
            .expression("resource_type:image")
            .max_results(100)
            .execute();

        const images = result.resources
            .filter((img) => /^food_\d+$/.test(img.public_id))
            .sort((a, b) => {
                const n1 = Number(a.public_id.match(/\d+/)?.[0] || 0);
                const n2 = Number(b.public_id.match(/\d+/)?.[0] || 0);
                return n1 - n2;
            });

        if (images.length !== 32) {
            console.log(`Expected 32 images, found ${images.length}`);
            process.exit(0);
        }

        const docs = foods.map((food, index) => ({
            ...food,
            description: "Food provides essential nutrients for overall health and well-being.",
            image: images[index].secure_url,
        }));

        await FoodModel.insertMany(docs);
        console.log("✅ Successfully inserted 32 food items.");
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

seed();