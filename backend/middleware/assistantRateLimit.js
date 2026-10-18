const WINDOW_MS = 5 * 60 * 1000;
const MAX_REQUESTS = 20;
const MAX_TRACKED_KEYS = 5000;
const requestBuckets = new Map();

const assistantRateLimit = (req, res, next) => {
    const key =
        req.authenticatedUserId ||
        req.ip ||
        req.socket.remoteAddress ||
        "unknown";
    const now = Date.now();
    let bucket = requestBuckets.get(key);

    if (!bucket || now - bucket.startedAt >= WINDOW_MS) {
        bucket = { startedAt: now, count: 0 };
        requestBuckets.set(key, bucket);
    }

    if (bucket.count >= MAX_REQUESTS) {
        const retryAfterSeconds = Math.ceil(
            (WINDOW_MS - (now - bucket.startedAt)) / 1000
        );
        res.set("Retry-After", String(retryAfterSeconds));
        return res.status(429).json({
            success: false,
            message: "Too many assistant messages. Please try again in a few minutes.",
        });
    }

    bucket.count += 1;

    if (requestBuckets.size > MAX_TRACKED_KEYS) {
        for (const [trackedKey, trackedBucket] of requestBuckets) {
            if (now - trackedBucket.startedAt >= WINDOW_MS) {
                requestBuckets.delete(trackedKey);
            }
        }
    }

    return next();
};

export default assistantRateLimit;
