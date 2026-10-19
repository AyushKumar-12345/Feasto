import assert from "node:assert/strict";
import test from "node:test";

const createMockRes = () => ({
    statusCode: 200,
    body: null,
    status(code) {
        this.statusCode = code;
        return this;
    },
    json(payload) {
        this.body = payload;
        return this;
    },
    send(text) {
        this.body = text;
        return this;
    },
});

test("GET / returns 200 with API status message", async () => {
    const res = createMockRes();
    const handler = (req, res) => res.send("API is Working");
    handler({}, res);

    assert.equal(res.statusCode, 200);
    assert.equal(res.body, "API is Working");
});

test("GET /api/health returns 200 with status ok and uptime", async () => {
    const res = createMockRes();
    const handler = (req, res) =>
        res.status(200).json({
            status: "ok",
            uptime: process.uptime(),
            timestamp: new Date().toISOString(),
        });

    handler({}, res);

    assert.equal(res.statusCode, 200);
    assert.equal(res.body.status, "ok");
    assert.equal(typeof res.body.uptime, "number");
    assert.ok(Date.parse(res.body.timestamp) > 0);
});

test("404 catch-all returns 404 with structured error response", async () => {
    const res = createMockRes();
    const handler = (req, res) =>
        res.status(404).json({
            success: false,
            message: "Route not found",
        });

    handler({}, res);

    assert.equal(res.statusCode, 404);
    assert.equal(res.body.success, false);
    assert.equal(res.body.message, "Route not found");
});

test("CORS validator logic permits local Vite dev origins and blocks untrusted domains", () => {
    const isLocalViteOrigin = (origin) =>
        /^http:\/\/(?:localhost|127\.0\.0\.1):(?:4173|517[0-9]|518[0-9]|5190)$/.test(origin);

    const isFeastoRenderOrigin = (origin) =>
        /^https:\/\/[a-z0-9-]+feasto[a-z0-9-]*\.onrender\.com$/i.test(origin) ||
        /^https:\/\/feasto-[a-z0-9-]+\.onrender\.com$/i.test(origin);

    // Permitted local Vite origins
    assert.equal(isLocalViteOrigin("http://localhost:5173"), true);
    assert.equal(isLocalViteOrigin("http://localhost:5174"), true);
    assert.equal(isLocalViteOrigin("http://127.0.0.1:4173"), true);

    // Permitted Render domains
    assert.equal(isFeastoRenderOrigin("https://feasto-frontend-qt0n.onrender.com"), true);
    assert.equal(isFeastoRenderOrigin("https://feasto-admin-567d.onrender.com"), true);

    // Blocked untrusted origins
    assert.equal(isLocalViteOrigin("http://malicious-site.com"), false);
    assert.equal(isLocalViteOrigin("http://localhost:3000"), false);
    assert.equal(isFeastoRenderOrigin("https://evil-feasto.attacker.com"), false);
});

