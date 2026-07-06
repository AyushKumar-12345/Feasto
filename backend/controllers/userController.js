import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import validator from "validator";

import UserModel from "../models/userModel.js";

const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });
};

const loginUser = async (req, res) => {
    try {
        let { email = "", password = "" } = req.body;

        email = email.trim().toLowerCase();

        if (!email || !password) {
            return res.json({
                success: false,
                message: "All fields are required",
            });
        }

        const user = await UserModel.findOne({ email });

        if (!user) {
            return res.json({
                success: false,
                message: "User doesn't exist",
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.json({
                success: false,
                message: "Invalid Credentials",
            });
        }

        const token = createToken(user._id);

        return res.json({
            success: true,
            token,
        });
    } catch (error) {
        console.error(error);
        return res.json({
            success: false,
            message: error.message,
        });
    }
};

const registerUser = async (req, res) => {
    try {
        let { name = "", email = "", password = "" } = req.body;

        name = name.trim();
        email = email.trim().toLowerCase();

        if (!name || !email || !password) {
            return res.json({
                success: false,
                message: "All fields are required",
            });
        }

        const existingUser = await UserModel.findOne({ email });

        if (existingUser) {
            return res.json({
                success: false,
                message: "User already exists",
            });
        }

        if (!validator.isEmail(email)) {
            return res.json({
                success: false,
                message: "Please enter a valid email",
            });
        }

        if (
            !validator.isStrongPassword(password, {
                minLength: 8,
                minLowercase: 1,
                minUppercase: 1,
                minNumbers: 1,
                minSymbols: 0,
            })
        ) {
            return res.json({
                success: false,
                message:
                    "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number.",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await UserModel.create({
            name,
            email,
            password: hashedPassword,
        });

        const token = createToken(user._id);

        return res.json({
            success: true,
            token,
        });
    } catch (error) {
        console.error(error);
        return res.json({
            success: false,
            message: error.message,
        });
    }
};

export { loginUser, registerUser };