import UserModel from "../models/userModel.js";
import { verifyCustomerToken } from "../config/authTokens.js";

const optionalCustomerAuth = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader === undefined) {
        return next();
    }

    const tokenMatch =
        typeof authHeader === "string"
            ? /^Bearer ([^\s]+)$/.exec(authHeader)
            : null;
    if (!tokenMatch) {
        return res.status(401).json({
            success: false,
            message: "Invalid authorization header.",
        });
    }

    try {
        const userId = verifyCustomerToken(tokenMatch[1]);
        const userExists = await UserModel.exists({ _id: userId });
        if (!userExists) {
            return res.status(401).json({
                success: false,
                message: "Customer account not found. Please sign in again.",
            });
        }

        req.authenticatedUserId = userId;
        return next();
    } catch (error) {
        if (error.name !== "JsonWebTokenError" &&
            error.name !== "TokenExpiredError" &&
            error.message !== "Invalid customer token claims.") {
            console.error("Optional customer authentication lookup failed.", error);
            return res.status(500).json({
                success: false,
                message: "Unable to verify your account right now.",
            });
        }
        return res.status(401).json({
            success: false,
            message: "Invalid or expired customer token.",
        });
    }
};

export default optionalCustomerAuth;
