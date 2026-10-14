import { createContext, useCallback, useEffect, useState } from "react";
import axios from "axios";

export const StoreContext = createContext(null);

const getCustomerToken = () => {
    const token = localStorage.getItem("token");

    if (!token) {
        return "";
    }

    try {
        const encodedPayload = token.split(".")[1]
            .replace(/-/g, "+")
            .replace(/_/g, "/");
        const paddedPayload = encodedPayload.padEnd(
            encodedPayload.length + ((4 - (encodedPayload.length % 4)) % 4),
            "="
        );
        const payload = JSON.parse(window.atob(paddedPayload));

        if (!payload.id || payload.role === "admin") {
            localStorage.removeItem("token");
            return "";
        }
    } catch {
        localStorage.removeItem("token");
        return "";
    }

    return token;
};

const StoreContextProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState({});
    const [food_list, setFoodList] = useState([]);
    const [token, setToken] = useState(getCustomerToken);
    const [userName, setUserName] = useState(
        localStorage.getItem("userName") || ""
    );

    const [profileImage, setProfileImage] = useState(
        localStorage.getItem("profileImage") || ""
    );

    const url =
        import.meta.env.VITE_BACKEND_URL ||
        "https://feasto-backend-pcbq.onrender.com";

    const authHeader = (token) => ({
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    const addToCart = async (itemId) => {
        if (token) {
            try {
                await axios.post(
                    `${url}/api/cart/add`,
                    { itemId },
                    authHeader(token)
                );

                setCartItems((prev) => ({
                    ...prev,
                    [itemId]: (prev[itemId] || 0) + 1,
                }));
            } catch (error) {
                console.error(error);
            }
        } else {
            setCartItems((prev) => ({
                ...prev,
                [itemId]: (prev[itemId] || 0) + 1,
            }));
        }
    };

    const removeFromCart = async (itemId) => {
        if (token) {
            try {
                await axios.post(
                    `${url}/api/cart/remove`,
                    { itemId },
                    authHeader(token)
                );

                setCartItems((prev) => {
                    const updated = { ...prev };

                    if (updated[itemId] > 1) {
                        updated[itemId]--;
                    } else {
                        delete updated[itemId];
                    }

                    return updated;
                });
            } catch (error) {
                console.error(error);
            }
        } else {
            setCartItems((prev) => {
                const updated = { ...prev };

                if (updated[itemId] > 1) {
                    updated[itemId]--;
                } else {
                    delete updated[itemId];
                }

                return updated;
            });
        }
    };

    const getTotalCartAmount = () => {
        let totalAmount = 0;

        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                const itemInfo = food_list.find(
                    (product) => product._id === item
                );

                if (itemInfo) {
                    totalAmount +=
                        itemInfo.price * cartItems[item];
                }
            }
        }

        return totalAmount;
    };

    const fetchFoodList = useCallback(async () => {
        try {
            const response = await axios.get(
                `${url}/api/food/list`
            );

            if (response.data.success) {
                setFoodList(response.data.data);
            }
        } catch (error) {
            console.error(error);
        }
    }, [url]);

    const loadCartData = useCallback(async (savedToken) => {
        try {
            const response = await axios.post(
                `${url}/api/cart/get`,
                {},
                authHeader(savedToken)
            );

            if (response.data.success) {
                setCartItems(response.data.cartData || {});
            }
        } catch (error) {
            console.error(error);
        }
    }, [url]);

    useEffect(() => {
        localStorage.setItem("profileImage", profileImage);
    }, [profileImage]);

    useEffect(() => {
        fetchFoodList();
    }, [fetchFoodList]);

    useEffect(() => {
        if (token) {
            loadCartData(token);
        }
    }, [loadCartData, token]);

    useEffect(() => {
        localStorage.setItem("userName", userName);
    }, [userName]);

    // Clear cart local state immediately on token change (logout handling fallback)
    useEffect(() => {
        if (!token) {
            setCartItems({});
        }
    }, [token]);

    const contextValue = {
        food_list,
        cartItems,
        setCartItems,
        addToCart,
        removeFromCart,
        getTotalCartAmount,
        url,
        token,
        setToken,
        profileImage,
        setProfileImage,
        userName,
        setUserName,
    };

    return (
        <StoreContext.Provider value={contextValue}>
            {children}
        </StoreContext.Provider>
    );
};

export default StoreContextProvider;