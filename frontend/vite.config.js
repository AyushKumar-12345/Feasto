import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, "..", "");
    const backendTarget =
        env.VITE_BACKEND_URL ||
        (mode === "development"
            ? "http://localhost:4000"
            : "https://feasto-backend-pcbq.onrender.com");

    return {
        plugins: [react()],
        envDir: "..",
        server: {
            proxy: {
                "/api": {
                    target: backendTarget,
                    changeOrigin: true,
                    secure: backendTarget.startsWith("https"),
                },
            },
        },
    };
});