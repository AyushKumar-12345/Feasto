import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
            trim: true,
        },
        items: {
            type: Array,
            required: true,
        },
        amount: {
            type: Number,
            required: true,
            min: 0,
        },
        address: {
            type: Object,
            required: true,
        },
        status: {
            type: String,
            default: "Food Processing",
            trim: true,
        },
        payment: {
            type: Boolean,
            default: false,
        },
        paymentId: {
            type: String,
            default: "",
            trim: true,
        },
        paymentMethod: {
            type: String,
            default: "Cash on Delivery",
            trim: true,
        },
        paymentStatus: {
            type: String,
            default: "Pending",
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

const OrderModel =
    mongoose.models.order || mongoose.model("order", orderSchema);

export default OrderModel;