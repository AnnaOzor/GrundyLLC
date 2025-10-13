import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
    const url = "https://grundyllc-backend.onrender.com";

    const [cartItems, setCartItems] = useState({});
    const [grocery_list, setGroceryList] = useState([]);
    const [token, setToken] = useState(() => localStorage.getItem("token") || "");

    // Add item to cart
    const addToCart = async (itemId) => {
        setCartItems(prev => ({
            ...prev,
            [itemId]: (prev[itemId] || 0) + 1
        }));

        if (token) {
            try {
                await axios.post(`${url}/api/cart/add`, { itemId }, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } catch (err) {
                console.error("Failed to add item to cart in DB:", err.response?.data || err.message);
            }
        }
    };

    // Remove item from cart
    const removeFromCart = async (itemId) => {
        setCartItems(prev => {
            const newQty = Math.max((prev[itemId] || 0) - 1, 0);
            return { ...prev, [itemId]: newQty };
        });

        if (token) {
            try {
                await axios.post(`${url}/api/cart/remove`, { itemId }, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } catch (err) {
                console.error("Failed to remove item from cart in DB:", err.response?.data || err.message);
            }
        }
    };

    // Get total cart amount
    const getTotalCartAmount = () => {
        let totalAmount = 0;
        for (const itemId in cartItems) {
            const qty = cartItems[itemId];
            if (qty > 0) {
                const product = grocery_list.find((p) => String(p._id) === String(itemId));
                if (product) {
                    const price = typeof product.price === 'string'
                        ? Number(product.price.replace(/,/g, ''))
                        : Number(product.price);
                    totalAmount += price * qty;
                }
            }
        }
        return totalAmount;
    };

    // Fetch grocery list (public for all users)
    const fetchGroceryList = async () => {
        try {
            const response = await axios.get(`${url}/api/grocery/public`);
            if (response.data.success) setGroceryList(response.data.data);
        } catch (err) {
            console.error("Failed to fetch groceries:", err.response?.data || err.message);
        }
    };

    // Load cart data for logged-in users
    const loadCartData = async () => {
        if (!token) return;
        try {
            const response = await axios.post(`${url}/api/cart/get`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCartItems(response.data.cartData);
        } catch (err) {
            console.error("Failed to load cart data:", err.response?.data || err.message);
        }
    };

    // Load initial data
    useEffect(() => {
        async function loadData() {
            await fetchGroceryList(); // always fetch public groceries
            const storedToken = localStorage.getItem("token");
            if (storedToken) {
                setToken(storedToken);
                await loadCartData(); // load cart only if logged in
            }
        }
        loadData();
    }, []);

    const contextValue = {
        grocery_list,
        cartItems,
        setCartItems,
        addToCart,
        removeFromCart,
        getTotalCartAmount,
        url,
        token,
        setToken
    };

    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    );
};

export default StoreContextProvider;
