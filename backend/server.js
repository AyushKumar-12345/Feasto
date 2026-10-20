import "./config/loadEnv.js";
import dns from "node:dns";
import express from "express";
import cors from "cors";

import { connectDB } from "./config/db.js";
import adminRouter from "./routes/adminRoute.js";
import cartRouter from "./routes/cartRoute.js";
import foodRouter from "./routes/foodRoute.js";
import orderRouter from "./routes/orderRoute.js";
import userRouter from "./routes/userRoute.js";
import assistantRouter from "./routes/assistantRoute.js";

if (process.env.MONGODB_URI?.startsWith("mongodb+srv://")) {
    try {
        dns.setServers(["8.8.8.8", "1.1.1.1"]);
    } catch {
        // Ignore if system restricts custom DNS servers
    }
}

const app = express();
const port = process.env.PORT || 4000;

app.set("trust proxy", 1);

const rawAllowedOrigins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "https://feasto-frontend-qt0n.onrender.com",
    "https://feasto-admin-567d.onrender.com",
    process.env.FRONTEND_URL,
    process.env.ADMIN_URL,
    process.env.VITE_FRONTEND_URL,
    process.env.VITE_ADMIN_URL,
];

const allowedOrigins = rawAllowedOrigins
    .filter(Boolean)
    .map((origin) => origin.replace(/\/+$/, ""));

app.use(
    cors({
        origin(origin, callback) {
            const normalizedOrigin = (origin || "").replace(/\/+$/, "");
            const isLocalViteOrigin =
                /^http:\/\/(?:localhost|127\.0\.0\.1):(?:4173|517[0-9]|518[0-9]|5190)$/.test(normalizedOrigin);
            const isFeastoRenderOrigin =
                /^https:\/\/[a-z0-9-]+feasto[a-z0-9-]*\.onrender\.com$/i.test(normalizedOrigin) ||
                /^https:\/\/feasto-[a-z0-9-]+\.onrender\.com$/i.test(normalizedOrigin);

            if (!origin || allowedOrigins.includes(normalizedOrigin) || isLocalViteOrigin || isFeastoRenderOrigin) {
                callback(null, true);
            } else {
                callback(new Error(`Not allowed by CORS: ${origin}`));
            }
        },
        credentials: true,
        exposedHeaders: ["x-rtb-fingerprint-id", "request-id", "Authorization"],
    })
);

app.use(express.json({ limit: "10mb" }));

connectDB();

app.use("/api/admin", adminRouter);
app.use("/api/food", foodRouter);
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);
app.use("/api/assistant", assistantRouter);

app.get("/", (req, res) => {
    res.send("API is Working");
});

app.get("/api/health", (req, res) => {
    return res.status(200).json({
        status: "ok",
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
    });
});

app.use((req, res) => {
    return res.status(404).json({
        success: false,
        message: "Route not found",
    });
});

app.use((err, req, res, next) => {
    console.error(err);
    return res.status(res.statusCode === 200 ? 500 : res.statusCode || 500).json({
        success: false,
        message: err.message || "Internal Server Error",
    });
});

const host = process.env.HOST || "0.0.0.0";

app.listen(port, host, () => {
    console.log(`Server started on http://${host}:${port}`);
});