import { verifyAdminToken } from "../config/authTokens.js";

const adminAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const tokenMatch =
        typeof authHeader === "string"
            ? /^Bearer ([^\s]+)$/.exec(authHeader)
            : null;

    if (!tokenMatch) {
        return res.status(401).json({
            success: false,
            message: "Admin Not Authorized",
        });
    }

    try {
        verifyAdminToken(tokenMatch[1]);
        return next();
    } catch (error) {
        if (error.name !== "JsonWebTokenError" &&
            error.name !== "TokenExpiredError" &&
            error.message !== "Invalid admin token claims.") {
            console.error("Admin authentication failed.", error);
            return res.status(500).json({
                success: false,
                message: "Unable to verify administrator access right now.",
            });
        }
        return res.status(401).json({
            success: false,
            message: "Invalid or Expired Admin Token",
        });
    }
};

export default adminAuth;