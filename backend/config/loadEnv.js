import dotenv from "dotenv";
import dns from "node:dns";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const configDirectory = dirname(fileURLToPath(import.meta.url));
const repositoryRoot = resolve(configDirectory, "../..");
const backendDirectory = resolve(configDirectory, "..");

// Try loading from repository root, backend folder, and current working directory
dotenv.config({ path: resolve(repositoryRoot, ".env") });
dotenv.config({ path: resolve(backendDirectory, ".env") });
dotenv.config();

// Ensure Google and Cloudflare DNS are set for MongoDB Atlas SRV resolution
try {
    dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch {
    // Ignore if system restricts custom DNS servers
}

