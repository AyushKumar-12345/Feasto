import assert from "node:assert/strict";
import test from "node:test";

const { mergeGuestCart } = await import("../controllers/cartController.js");
const FoodModel = (await import("../models/foodModel.js")).default;
const UserModel = (await import("../models/userModel.js")).default;

const itemId = "64b000000000000000000001";
const userId = "64b000000000000000000002";
const mergeId = "550e8400-e29b-41d4-a716-446655440000";

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

test("guest cart merge adds quantities to the signed-in cart and caps item quantities", async () => {
    const originalFoodExists = FoodModel.exists;
    const originalFindById = UserModel.findById;
    const originalFindOneAndUpdate = UserModel.findOneAndUpdate;
    let savedCart;
    FoodModel.exists = async () => ({ _id: itemId });
    UserModel.findById = async () => ({
        cartData: { [itemId]: 98 },
    });
    UserModel.findOneAndUpdate = async (_query, update) => {
        savedCart = update.$set.cartData;
        return {
            cartData: update.$set.cartData,
        };
    };

    try {
        const response = createResponse();
        await mergeGuestCart(
            {
                authenticatedUserId: userId,
                body: { guestCart: { [itemId]: 5 }, mergeId },
            },
            response
        );

        assert.equal(response.statusCode, 200);
        assert.deepEqual(response.body.cartData, { [itemId]: 99 });
        assert.deepEqual(savedCart, { [itemId]: 99 });
    } finally {
        FoodModel.exists = originalFoodExists;
        UserModel.findById = originalFindById;
        UserModel.findOneAndUpdate = originalFindOneAndUpdate;
    }
});

test("guest cart merge rejects malformed item quantities", async () => {
    const response = createResponse();
    await mergeGuestCart(
        {
            authenticatedUserId: userId,
            body: { guestCart: { [itemId]: 0 }, mergeId },
        },
        response
    );

    assert.equal(response.statusCode, 400);
    assert.equal(response.body.success, false);
});

test("repeating a completed guest cart merge does not add the cart twice", async () => {
    const originalFindById = UserModel.findById;
    const originalFindOneAndUpdate = UserModel.findOneAndUpdate;
    let updateCalled = false;
    UserModel.findById = async () => ({
        lastGuestCartMergeId: mergeId,
        cartData: { [itemId]: 3 },
    });
    UserModel.findOneAndUpdate = async () => {
        updateCalled = true;
    };

    try {
        const response = createResponse();
        await mergeGuestCart(
            {
                authenticatedUserId: userId,
                body: { guestCart: { [itemId]: 2 }, mergeId },
            },
            response
        );

        assert.equal(response.statusCode, 200);
        assert.deepEqual(response.body.cartData, { [itemId]: 3 });
        assert.equal(updateCalled, false);
    } finally {
        UserModel.findById = originalFindById;
        UserModel.findOneAndUpdate = originalFindOneAndUpdate;
    }
});
