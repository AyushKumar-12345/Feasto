import React, { useContext, useEffect, useState } from "react";
import "./Verify.css";
import { useNavigate, useSearchParams } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { CircleCheckBig, CircleX } from "lucide-react";

const Verify = () => {
    const [searchParams] = useSearchParams();

    const success = searchParams.get("success");
    const orderId = searchParams.get("orderId");
    const razorpay_order_id = searchParams.get("razorpay_order_id");
    const razorpay_payment_id = searchParams.get("razorpay_payment_id");
    const razorpay_signature = searchParams.get("razorpay_signature");

    const { url } = useContext(StoreContext);
    const navigate = useNavigate();

    const [status, setStatus] = useState("verifying");

    const verifyPayment = async () => {
        try {
            const response = await axios.post(
                `${url}/api/order/verify`,
                {
                    success,
                    orderId,
                    razorpay_order_id,
                    razorpay_payment_id,
                    razorpay_signature,
                }
            );

            if (response.data.success) {
                setStatus("success");

                setTimeout(() => {
                    navigate("/myorders", { replace: true });
                }, 1800);
            } else {
                setStatus("failed");

                setTimeout(() => {
                    navigate("/", { replace: true });
                }, 1800);
            }
        } catch (error) {
            setStatus("failed");

            setTimeout(() => {
                navigate("/", { replace: true });
            }, 1800);
        }
    };

    useEffect(() => {
        let isActive = true;

        if (orderId && success !== null) {
            verifyPayment();
        } else {
            navigate("/", { replace: true });
        }

        return () => {
            isActive = false;
        };
    }, [orderId, success]);

    return (
        <section className="verify">
            {status === "verifying" && (
                <div className="verify-card">
                    <div className="spinner"></div>
                    <h2>Verifying Payment...</h2>
                    <p>Please wait while we confirm your payment.</p>
                </div>
            )}

            {status === "success" && (
                <div className="verify-card success">
                    <CircleCheckBig size={70} />
                    <h2>Payment Successful</h2>
                    <p>Your order has been placed successfully.</p>
                </div>
            )}

            {status === "failed" && (
                <div className="verify-card failed">
                    <CircleX size={70} />
                    <h2>Payment Failed</h2>
                    <p>
                        Something went wrong while verifying your payment.
                    </p>
                </div>
            )}
        </section>
    );
};

export default Verify;