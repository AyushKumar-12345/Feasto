const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 10;
const attemptsByKey = new Map();
let requestsSinceCleanup = 0;

const authRateLimit = (req, res, next) => {
    const now = Date.now();
    const ip = req.ip || req.socket.remoteAddress || "unknown";
    const identity = typeof req.body?.email === "string"
        ? req.body.email.trim().toLowerCase()
        : "missing-email";
    const key = `${ip}:${req.baseUrl}${req.path}:${identity}`;
    const record = attemptsByKey.get(key);

    if (record && record.resetAt > now && record.count >= MAX_ATTEMPTS) {
        return res
            .set("Retry-After", String(Math.ceil((record.resetAt - now) / 1000)))
            .status(429)
            .json({
                success: false,
                message: "Too many authentication attempts. Please try again later.",
            });
    }

    res.on("finish", () => {
        const isFailedLogin = res.statusCode === 401;
        const isInvalidRegistration =
            req.path === "/register" &&
            (res.statusCode === 400 || res.statusCode === 409);

        if (isFailedLogin || isInvalidRegistration) {
            const current = attemptsByKey.get(key);
            const failedRecord = current && current.resetAt > Date.now()
                ? current
                : { count: 0, resetAt: Date.now() + WINDOW_MS };
            failedRecord.count += 1;
            attemptsByKey.set(key, failedRecord);
        } else {
            attemptsByKey.delete(key);
        }
    });

    requestsSinceCleanup += 1;
    if (requestsSinceCleanup >= 250) {
        requestsSinceCleanup = 0;
        for (const [attemptKey, attempt] of attemptsByKey) {
            if (attempt.resetAt <= now) attemptsByKey.delete(attemptKey);
        }
    }

    return next();
};

export default authRateLimit;
