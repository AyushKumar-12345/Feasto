import React, { useContext } from "react";
import "./Cart.css";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";
import { Trash2, ShoppingBag } from "lucide-react";
import { toast } from "react-toastify";

const Cart = () => {
    const {
        cartItems,
        food_list,
        removeFromCart,
        getTotalCartAmount,
    } = useContext(StoreContext);

    const navigate = useNavigate();

    const subtotal = getTotalCartAmount();
    const deliveryFee = subtotal > 0 ? 2 : 0;
    const total = subtotal + deliveryFee;

    const cartProducts = food_list.filter(
        (item) => (cartItems?.[item._id] || 0) > 0
    );

    const handleCheckout = () => {
        const token = localStorage.getItem("token");

        if (!token) {
            toast.info("Please login to continue checkout 🚀");
            return;
        }

        navigate("/order");
    };

    return (
        <section className="cart">
            {cartProducts.length === 0 ? (
                <div className="empty-cart">
                    <ShoppingBag size={70} />
                    <h2>Your Cart is Empty</h2>
                    <p>
                        Looks like you haven't added any delicious food yet.
                    </p>

                    <button onClick={() => navigate("/")}>
                        Browse Menu
                    </button>
                </div>
            ) : (
                <>
                    <div className="cart-items">
                        <div className="cart-items-title">
                            <p>Item</p>
                            <p>Name</p>
                            <p>Price</p>
                            <p>Qty</p>
                            <p>Total</p>
                            <p>Remove</p>
                        </div>

                        <hr />

                        {cartProducts.map((item) => (
                            <div key={item._id}>
                                <div className="cart-items-title cart-items-item">
                                    <img src={item.image} alt={item.name} />

                                    <p>{item.name}</p>
                                    <p>₹{item.price}</p>
                                    <p>{cartItems[item._id]}</p>
                                    <p>
                                        ₹{item.price * cartItems[item._id]}
                                    </p>

                                    <button
                                        type="button"
                                        className="remove-btn"
                                        onClick={() => removeFromCart(item._id)}
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>

                                <hr />
                            </div>
                        ))}
                    </div>

                    <div className="cart-bottom">
                        <div className="cart-total">
                            <h2>Cart Totals</h2>

                            <div>
                                <div className="cart-total-details">
                                    <p>Subtotal</p>
                                    <p>₹{subtotal}</p>
                                </div>

                                <hr />

                                <div className="cart-total-details">
                                    <p>Delivery Fee</p>
                                    <p>₹{deliveryFee}</p>
                                </div>

                                <hr />

                                <div className="cart-total-details">
                                    <b>Total</b>
                                    <b>₹{total}</b>
                                </div>
                            </div>

                            <button className="btn btn-primary" onClick={handleCheckout}>
                                Proceed to Checkout
                            </button>
                        </div>

                        <div className="cart-promocode">
                            <p>Have a promo code? Enter it below.</p>

                            <div className="cart-promocode-input">
                                <input type="text" placeholder="Promo Code" />

                                <button
                                    type="button"
                                    onClick={() =>
                                        toast.info("Promo code feature coming soon!")
                                    }
                                >
                                    Apply
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </section>
    );
};

export default Cart;