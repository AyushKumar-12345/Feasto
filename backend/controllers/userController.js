import bcrypt from "bcryptjs";
import validator from "validator";

import { createCustomerToken } from "../config/authTokens.js";
import UserModel from "../models/userModel.js";

const loginUser = async (req, res) => {
    try {
        if (!process.env.JWT_SECRET) {
            console.error("Customer login is missing JWT_SECRET.");
            return res.status(500).json({
                success: false,
                message: "Login is not configured.",
            });
        }

        const { email: submittedEmail, password } = req.body || {};

        if (
            typeof submittedEmail !== "string" ||
            typeof password !== "string" ||
            !submittedEmail.trim() ||
            !password
        ) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required",
            });
        }

        const email = submittedEmail.trim().toLowerCase();
        if (!validator.isEmail(email)) {
            return res.status(400).json({
                success: false,
                message: "Please enter a valid email",
            });
        }

        const user = await UserModel.findOne({ email });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        const token = createCustomerToken(user._id);

        return res.json({
            success: true,
            token,
            name: user.name,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Unable to log in right now. Please try again.",
        });
    }
};

const registerUser = async (req, res) => {
    try {
        if (!process.env.JWT_SECRET) {
            console.error("Customer registration is missing JWT_SECRET.");
            return res.status(500).json({
                success: false,
                message: "Registration is not configured.",
            });
        }

        const {
            name: submittedName,
            email: submittedEmail,
            password,
        } = req.body || {};

        if (
            typeof submittedName !== "string" ||
            typeof submittedEmail !== "string" ||
            typeof password !== "string"
        ) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        const name = submittedName.trim();
        const email = submittedEmail.trim().toLowerCase();

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({
                success: false,
                message: "Please enter a valid email",
            });
        }

        if (name.length > 100) {
            return res.status(400).json({
                success: false,
                message: "Name must be 100 characters or fewer",
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
            return res.status(400).json({
                success: false,
                message:
                    "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number.",
            });
        }

        const existingUser = await UserModel.findOne({ email });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "An account with this email already exists",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await UserModel.create({
            name,
            email,
            password: hashedPassword,
        });

        const token = createCustomerToken(user._id);

        return res.json({
            success: true,
            token,
            name: user.name,
        });
    } catch (error) {
        console.error(error);
        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "An account with this email already exists",
            });
        }

        return res.status(500).json({
            success: false,
            message: "Unable to create your account right now. Please try again.",
        });
    }
};

export { loginUser, registerUser };