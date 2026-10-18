import "./loadEnv.js";
import Razorpay from "razorpay";

const getRazorpayInstance = () => {
    const key_id = process.env.RAZORPAY_KEY_ID;
    const key_secret = process.env.RAZORPAY_KEY_SECRET;

    if (!key_id || !key_secret) {
        return new Proxy(
            {},
            {
                get() {
                    return () => {
                        throw new Error(
                            "Razorpay is not configured. Missing RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET."
                        );
                    };
                },
            }
        );
    }

    return new Razorpay({
        key_id,
        key_secret,
    });
};

const razorpay = getRazorpayInstance();

export default razorpay;