import "./loadEnv.js";
import jwt from "jsonwebtoken";

const ISSUER = "feasto-api";
const CUSTOMER_AUDIENCE = "feasto-customer";
const ADMIN_AUDIENCE = "feasto-admin";
const OBJECT_ID_PATTERN = /^[a-f\d]{24}$/i;

const verifyToken = (token, audience) =>
    jwt.verify(token, process.env.JWT_SECRET, {
        algorithms: ["HS256"],
        issuer: ISSUER,
        audience,
    });

export const createCustomerToken = (id) => {
    const userId = String(id);
    return jwt.sign(
        { id: userId, sub: userId, role: "user" },
        process.env.JWT_SECRET,
        {
            algorithm: "HS256",
            expiresIn: "7d",
            issuer: ISSUER,
            audience: CUSTOMER_AUDIENCE,
        }
    );
};

export const createAdminToken = () =>
    jwt.sign(
        { sub: "admin", role: "admin" },
        process.env.JWT_SECRET,
        {
            algorithm: "HS256",
            expiresIn: "7d",
            issuer: ISSUER,
            audience: ADMIN_AUDIENCE,
        }
    );

export const verifyCustomerToken = (token) => {
    const decoded = verifyToken(token, CUSTOMER_AUDIENCE);
    if (
        !decoded ||
        typeof decoded !== "object" ||
        decoded.role !== "user" ||
        typeof decoded.id !== "string" ||
        !OBJECT_ID_PATTERN.test(decoded.id) ||
        decoded.sub !== decoded.id
    ) {
        throw new Error("Invalid customer token claims.");
    }
    return decoded.id;
};

export const verifyAdminToken = (token) => {
    const decoded = verifyToken(token, ADMIN_AUDIENCE);
    if (
        !decoded ||
        typeof decoded !== "object" ||
        decoded.role !== "admin" ||
        decoded.sub !== "admin"
    ) {
        throw new Error("Invalid admin token claims.");
    }
};
