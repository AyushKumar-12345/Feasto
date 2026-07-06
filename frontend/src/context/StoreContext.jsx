import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const StoreContext = createContext(null);

const StoreContextProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState({});
    const [food_list, setFoodList] = useState([]);
    const [token, setToken] = useState("");

    const [profileImage, setProfileImage] = useState(
        localStorage.getItem("profileImage") || ""
    );

    const url =
        import.meta.env.VITE_BACKEND_URL ||
        "http://feasto-backend-pcbq.onrender.com";

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

    const fetchFoodList = async () => {
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
    };

    const loadCartData = async (savedToken) => {
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
    };

    useEffect(() => {
        localStorage.setItem("profileImage", profileImage);
    }, [profileImage]);

    useEffect(() => {
        const loadData = async () => {
            await fetchFoodList();

            const savedToken = localStorage.getItem("token");

            if (savedToken) {
                setToken(savedToken);
                await loadCartData(savedToken);
            }
        };

        loadData();
    }, []);

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
    };

    return (
        <StoreContext.Provider value={contextValue}>
            {children}
        </StoreContext.Provider>
    );
};

export default StoreContextProvider;