import dns from "node:dns";
import express from "express";
import cors from "cors";
import "dotenv/config";

import { connectDB } from "./config/db.js";
import adminRouter from "./routes/adminRoute.js";
import cartRouter from "./routes/cartRoute.js";
import foodRouter from "./routes/foodRoute.js";
import orderRouter from "./routes/orderRoute.js";
import userRouter from "./routes/userRoute.js";

dns.setServers(["8.8.8.8", "1.1.1.1"]);

const app = express();
const port = process.env.PORT || 4000;

const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "https://feasto-frontend-qt0n.onrender.com",
    "https://feasto-admin-567d.onrender.com",
    process.env.FRONTEND_URL,
    process.env.ADMIN_URL,
].filter(Boolean);

app.use(
    cors({
        origin(origin, callback) {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error(`Not allowed by CORS: ${origin}`));
            }
        },
        credentials: true,
    })
);

app.use(express.json({ limit: "10mb" }));

connectDB();

app.use("/api/admin", adminRouter);
app.use("/api/food", foodRouter);
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);

app.get("/", (req, res) => {
    res.send("API is Working");
});

app.use((req, res) => {
    return res.status(404).json({
        success: false,
        message: "Route not found",
    });
});

app.use((err, req, res, next) => {
    console.error(err);

    return res.status(500).json({
        success: false,
        message: err.message || "Internal Server Error",
    });
});

app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`);
});