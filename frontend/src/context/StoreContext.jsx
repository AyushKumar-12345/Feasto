import { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import { StoreContext } from "./StoreContextValue";
import { food_list as sampleFoodList } from "../assets/assets";

const decodeTokenPayload = (rawToken) => {
    if (!rawToken || typeof rawToken !== "string") return null;
    try {
        const segments = rawToken.split(".");
        if (segments.length !== 3 || !segments.every(Boolean)) {
            return null;
        }
        const encodedPayload = segments[1]
            .replace(/-/g, "+")
            .replace(/_/g, "/");
        const paddedPayload = encodedPayload.padEnd(
            encodedPayload.length + ((4 - (encodedPayload.length % 4)) % 4),
            "="
        );
        return JSON.parse(window.atob(paddedPayload));
    } catch {
        return null;
    }
};

const getUserIdFromToken = (rawToken) => {
    const payload = decodeTokenPayload(rawToken);
    return typeof payload?.id === "string" ? payload.id : "";
};

const clearStoredCustomerSession = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("profileImage");
    localStorage.removeItem("favoriteFoodIds");
    localStorage.removeItem("guestCart");
    localStorage.removeItem("guestCartMerge");
};

const getCustomerToken = () => {
    const token = localStorage.getItem("token");

    if (!token) {
        clearStoredCustomerSession();
        return "";
    }

    try {
        const segments = token.split(".");
        if (segments.length !== 3 || !segments.every(Boolean)) {
            throw new Error("Malformed customer token.");
        }
        const header = JSON.parse(
            window.atob(
                segments[0]
                    .replace(/-/g, "+")
                    .replace(/_/g, "/")
                    .padEnd(segments[0].length + ((4 - (segments[0].length % 4)) % 4), "=")
            )
        );
        const payload = decodeTokenPayload(token);

        if (
            !payload ||
            typeof payload.id !== "string" ||
            !/^[a-f\d]{24}$/i.test(payload.id) ||
            payload.role !== "user" ||
            payload.sub !== payload.id ||
            payload.iss !== "feasto-api" ||
            payload.aud !== "feasto-customer" ||
            header.alg !== "HS256" ||
            !Number.isFinite(payload.exp) ||
            payload.exp <= Date.now() / 1000
        ) {
            clearStoredCustomerSession();
            return "";
        }
    } catch {
        clearStoredCustomerSession();
        return "";
    }

    return token;
};

const getSavedUserFavorites = (userId) => {
    if (!userId) return [];
    try {
        const userFavs = JSON.parse(
            localStorage.getItem(`feasto_favs_${userId}`) || "[]"
        );
        return Array.isArray(userFavs)
            ? userFavs.filter((id) => typeof id === "string")
            : [];
    } catch {
        return [];
    }
};

const getSavedUserProfile = (userId) => {
    if (!userId) return "";
    return localStorage.getItem(`feasto_profile_${userId}`) || "";
};

const StoreContextProvider = ({ children }) => {
    const initialToken = getCustomerToken();
    const initialUserId = getUserIdFromToken(initialToken);

    const [token, setToken] = useState(initialToken);
    const [userName, setUserName] = useState(
        () => (initialToken ? localStorage.getItem("userName") || "" : "")
    );
    const [profileImage, setProfileImage] = useState(
        () => getSavedUserProfile(initialUserId)
    );
    const [favoriteFoodIds, setFavoriteFoodIds] = useState(
        () => getSavedUserFavorites(initialUserId)
    );
    const [cartItems, setCartItems] = useState({});
    const [food_list, setFoodList] = useState([]);
    const [foodListSource, setFoodListSource] = useState("loading");

    const cartSyncToken = useRef("");

    const url = import.meta.env.DEV
        ? ""
        : import.meta.env.VITE_BACKEND_URL ||
          "https://feasto-backend-pcbq.onrender.com";

    const authHeader = (authToken) => ({
        headers: {
            Authorization: `Bearer ${authToken}`,
        },
    });

    const logout = useCallback(() => {
        clearStoredCustomerSession();
        setToken("");
        setUserName("");
        setProfileImage("");
        setCartItems({});
        setFavoriteFoodIds([]);
        cartSyncToken.current = "";
    }, []);

    const addToCart = async (itemId) => {
        if (!token) return;
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
            console.error("Failed to add to cart:", error);
        }
    };

    const removeFromCart = async (itemId) => {
        if (!token) return;
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
            console.error("Failed to remove from cart:", error);
        }
    };

    const toggleFavorite = (itemId) => {
        setFavoriteFoodIds((previousFavorites) =>
            previousFavorites.includes(itemId)
                ? previousFavorites.filter((id) => id !== itemId)
                : [...previousFavorites, itemId]
        );
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

            if (response.data.success && Array.isArray(response.data.data)) {
                setFoodList(response.data.data);
                setFoodListSource("api");
                return;
            }
            throw new Error(response.data.message || "Menu request failed.");
        } catch (error) {
            console.error(error);
            setFoodList(sampleFoodList);
            setFoodListSource("sample");
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
            console.error("Failed to load user cart:", error);
        }
    }, [url]);

    // When token changes (login, switch account, logout)
    useEffect(() => {
        if (token) {
            const userId = getUserIdFromToken(token);
            if (userId) {
                setFavoriteFoodIds(getSavedUserFavorites(userId));
                setProfileImage(getSavedUserProfile(userId));
                if (cartSyncToken.current !== token) {
                    cartSyncToken.current = token;
                    loadCartData(token);
                }
            }
        } else {
            cartSyncToken.current = "";
            setCartItems({});
            setFavoriteFoodIds([]);
            setProfileImage("");
            setUserName("");
        }
    }, [token, loadCartData]);

    // Persist favorites per user ID
    useEffect(() => {
        if (token) {
            const userId = getUserIdFromToken(token);
            if (userId) {
                localStorage.setItem(
                    `feasto_favs_${userId}`,
                    JSON.stringify(favoriteFoodIds)
                );
            }
        }
    }, [favoriteFoodIds, token]);

    // Persist profile photo per user ID
    useEffect(() => {
        if (token) {
            const userId = getUserIdFromToken(token);
            if (userId) {
                if (profileImage) {
                    localStorage.setItem(`feasto_profile_${userId}`, profileImage);
                } else {
                    localStorage.removeItem(`feasto_profile_${userId}`);
                }
            }
        }
    }, [profileImage, token]);

    useEffect(() => {
        fetchFoodList();
    }, [fetchFoodList]);

    // Handle 401 unauthenticated responses cleanly
    useEffect(() => {
        const interceptorId = axios.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response?.status === 401 && token) {
                    logout();
                }
                return Promise.reject(error);
            }
        );

        return () => axios.interceptors.response.eject(interceptorId);
    }, [token, logout]);

    useEffect(() => {
        if (userName && token) {
            localStorage.setItem("userName", userName);
        } else if (!token) {
            localStorage.removeItem("userName");
        }
    }, [userName, token]);

    const contextValue = {
        food_list,
        foodListSource,
        cartItems,
        setCartItems,
        favoriteFoodIds,
        toggleFavorite,
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
        logout,
    };

    return (
        <StoreContext.Provider value={contextValue}>
            {children}
        </StoreContext.Provider>
    );
};

export default StoreContextProvider;