import jwt from "jsonwebtoken";

const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body || {};

        if (typeof email !== "string" || typeof password !== "string") {
            return res.status(400).json({
                success: false,
                message: "Email and password are required.",
            });
        }

        if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD || !process.env.JWT_SECRET) {
            console.error("Admin login is missing required server configuration.");
            return res.status(500).json({
                success: false,
                message: "Admin login is not configured.",
            });
        }

        if (
            email.trim().toLowerCase() !== process.env.ADMIN_EMAIL.trim().toLowerCase() ||
            password !== process.env.ADMIN_PASSWORD
        ) {
            return res.status(401).json({
                success: false,
                message: "Invalid Admin Credentials",
            });
        }

        const token = jwt.sign(
            { role: "admin" },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        return res.json({
            success: true,
            token,
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

export { loginAdmin };