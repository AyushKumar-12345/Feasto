import assert from "node:assert/strict";
import test from "node:test";
import jwt from "jsonwebtoken";

process.env.JWT_SECRET = "feasto-auth-tests-use-a-non-production-secret";
process.env.RAZORPAY_KEY_ID = "razorpay-test-key";
process.env.RAZORPAY_KEY_SECRET = "razorpay-test-secret";

const { createAdminToken, createCustomerToken } = await import("../config/authTokens.js");
const adminAuth = (await import("../middleware/adminAuth.js")).default;
const authMiddleware = (await import("../middleware/auth.js")).default;
const optionalCustomerAuth = (await import("../middleware/optionalCustomerAuth.js")).default;
const UserModel = (await import("../models/userModel.js")).default;
const FoodModel = (await import("../models/foodModel.js")).default;
const OrderModel = (await import("../models/orderModel.js")).default;
const mongoose = (await import("mongoose")).default;
const razorpay = (await import("../config/razorpay.js")).default;
const { placeOrder, verifyOrder } = await import("../controllers/orderController.js");

const customerId = "64b000000000000000000001";

const createResponse = () => ({
    statusCode: 200,
    body: null,
    status(statusCode) {
        this.statusCode = statusCode;
        return this;
    },
    json(body) {
        this.body = body;
        return this;
    },
});

const makeRequest = (authorization, body = {}) => ({
    headers: authorization === undefined ? {} : { authorization },
    body,
});

test("customer auth requires a well-formed bearer token and refuses admin credentials", async () => {
    const missingRequest = makeRequest();
    const missingResponse = createResponse();
    await authMiddleware(missingRequest, missingResponse, () => {
        assert.fail("Missing token must not reach the route.");
    });
    assert.equal(missingResponse.statusCode, 401);

    const malformedRequest = makeRequest("Bearer token extra");
    const malformedResponse = createResponse();
    await authMiddleware(malformedRequest, malformedResponse, () => {
        assert.fail("Malformed bearer token must not reach the route.");
    });
    assert.equal(malformedResponse.statusCode, 401);

    const adminRequest = makeRequest(`Bearer ${createAdminToken()}`);
    const adminResponse = createResponse();
    await authMiddleware(adminRequest, adminResponse, () => {
        assert.fail("Admin token must not authorize a customer route.");
    });
    assert.equal(adminResponse.statusCode, 401);
});

test("customer auth rejects old, expired, and inconsistent JWT claims", async () => {
    const invalidTokens = [
        jwt.sign({ id: customerId, role: "user" }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        }),
        jwt.sign(
            { id: customerId, sub: "64b000000000000000000002", role: "user" },
            process.env.JWT_SECRET,
            {
                algorithm: "HS256",
                issuer: "feasto-api",
                audience: "feasto-customer",
                expiresIn: "1h",
            }
        ),
        jwt.sign(
            { id: customerId, sub: customerId, role: "user" },
            process.env.JWT_SECRET,
            {
                algorithm: "HS256",
                issuer: "feasto-api",
                audience: "feasto-customer",
                expiresIn: "-1s",
            }
        ),
    ];

    for (const token of invalidTokens) {
        const response = createResponse();
        await authMiddleware(makeRequest(`Bearer ${token}`), response, () => {
            assert.fail("Invalid claims must not reach the route.");
        });
        assert.equal(response.statusCode, 401);
    }
});

test("customer auth takes the principal from the token and checks the account exists", async () => {
    const originalExists = UserModel.exists;
    UserModel.exists = async () => ({ _id: customerId });

    try {
        const body = { userId: "64b000000000000000000099" };
        const request = makeRequest(`Bearer ${createCustomerToken(customerId)}`, body);
        const response = createResponse();
        let reachedRoute = false;

        await authMiddleware(request, response, () => {
            reachedRoute = true;
        });

        assert.equal(reachedRoute, true);
        assert.equal(request.authenticatedUserId, customerId);
        assert.equal(request.body.userId, "64b000000000000000000099");
    } finally {
        UserModel.exists = originalExists;
    }
});

test("customer auth rejects tokens for deleted accounts", async () => {
    const originalExists = UserModel.exists;
    UserModel.exists = async () => null;

    try {
        const response = createResponse();
        await authMiddleware(
            makeRequest(`Bearer ${createCustomerToken(customerId)}`),
            response,
            () => assert.fail("A deleted user must not reach the route.")
        );
        assert.equal(response.statusCode, 401);
    } finally {
        UserModel.exists = originalExists;
    }
});

test("admin auth accepts only a scoped admin token", () => {
    const adminResponse = createResponse();
    let adminReachedRoute = false;
    adminAuth(
        makeRequest(`Bearer ${createAdminToken()}`),
        adminResponse,
        () => {
            adminReachedRoute = true;
        }
    );
    assert.equal(adminReachedRoute, true);

    const customerResponse = createResponse();
    adminAuth(
        makeRequest(`Bearer ${createCustomerToken(customerId)}`),
        customerResponse,
        () => assert.fail("Customer token must not reach an admin route.")
    );
    assert.equal(customerResponse.statusCode, 401);
});

test("optional customer auth allows guests but validates any provided token", async () => {
    let guestReachedRoute = false;
    optionalCustomerAuth(makeRequest(), createResponse(), () => {
        guestReachedRoute = true;
    });
    assert.equal(guestReachedRoute, true);

    const response = createResponse();
    await optionalCustomerAuth(
        makeRequest("Bearer not-a-valid-token"),
        response,
        () => assert.fail("An invalid optional token must not be treated as a guest.")
    );
    assert.equal(response.statusCode, 401);
});

test("checkout uses the authenticated customer and server menu prices", async () => {
    const originalFind = FoodModel.find;
    const originalSave = OrderModel.prototype.save;
    const originalCreateOrder = razorpay.orders.create;
    const foodId = new mongoose.Types.ObjectId();
    const menuFood = {
        _id: foodId,
        name: "Server menu dish",
        description: "Priced by the server",
        price: 150,
        category: "Test",
        image: "https://images.example.test/dish.jpg",
    };
    let storedOrder;
    let razorpayOrderRequest;

    FoodModel.find = () => ({
        select: async () => [menuFood],
    });
    OrderModel.prototype.save = async function saveOrder() {
        this._id ||= new mongoose.Types.ObjectId();
        storedOrder = this;
        return this;
    };
    razorpay.orders.create = async (order) => {
        razorpayOrderRequest = order;
        return { id: "order_test", amount: order.amount, currency: "INR" };
    };

    try {
        const response = createResponse();
        await placeOrder(
            {
                authenticatedUserId: customerId,
                body: {
                    userId: "64b000000000000000000099",
                    items: [{
                        _id: String(foodId),
                        name: "Client-submitted fake dish",
                        price: 0.01,
                        quantity: 2,
                    }],
                    amount: 0.02,
                    address: {
                        firstName: "Test",
                        lastName: "Customer",
                        email: "test@example.com",
                        street: "1 Test Street",
                        city: "Test City",
                        state: "Test State",
                        zipCode: "12345",
                        country: "Test Country",
                        phone: "1234567890",
                    },
                },
            },
            response
        );

        assert.equal(response.statusCode, 200);
        assert.equal(storedOrder.userId, customerId);
        assert.equal(storedOrder.amount, 302);
        assert.equal(storedOrder.items[0].name, "Server menu dish");
        assert.equal(storedOrder.items[0].price, 150);
        assert.equal(storedOrder.items[0].quantity, 2);
        assert.equal(razorpayOrderRequest.amount, 30200);
    } finally {
        FoodModel.find = originalFind;
        OrderModel.prototype.save = originalSave;
        razorpay.orders.create = originalCreateOrder;
    }
});

test("payment verification scopes order lookup to the authenticated customer", async () => {
    const originalFindOne = OrderModel.findOne;
    let requestedOrderFilter;
    OrderModel.findOne = async (filter) => {
        requestedOrderFilter = filter;
        return null;
    };

    try {
        const response = createResponse();
        await verifyOrder(
            {
                authenticatedUserId: customerId,
                body: {
                    orderId: "64b000000000000000000010",
                    userId: "64b000000000000000000099",
                    success: true,
                },
            },
            response
        );

        assert.equal(response.statusCode, 404);
        assert.equal(requestedOrderFilter.userId, customerId);
    } finally {
        OrderModel.findOne = originalFindOne;
    }
});
