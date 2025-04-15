import { createContext, useEffect, useState } from "react";
import { food_list } from "../assets/assets"; // Import food list from local assets
import { toast } from "react-toastify";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const [cartItems, setCartItems] = useState({});
  const [token, setToken] = useState(""); // No need for token since no backend
  const [email, setEmail] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [loading, setLoading] = useState(false);

  const addToCart = (itemId) => {
    setCartItems((prev) => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1,
    }));

    toast.success("Item added to cart", { autoClose: 1000 });
  };

  const removeFromCart = (itemId) => {
    setCartItems((prev) => {
      const updatedCart = { ...prev };
      if (updatedCart[itemId] > 1) {
        updatedCart[itemId] -= 1;
      } else {
        delete updatedCart[itemId];
      }
      return updatedCart;
    });

    toast.warn("Item removed from cart", { autoClose: 1000 });
  };

  const getTotalCartAmount = () => {
    return Object.keys(cartItems).reduce((total, itemId) => {
      const itemInfo = food_list.find((product) => product._id === itemId);
      return total + (itemInfo ? itemInfo.price * cartItems[itemId] : 0);
    }, 0);
  };

  const removeAllFromCart = (itemId) => {
    setCartItems((prev) => {
      const updatedCart = { ...prev };
      delete updatedCart[itemId]; // Remove the item completely
      return updatedCart;
    });
  
    toast.warn("All items removed from cart", { autoClose: 1000 });
  };

  const applyPromoC = (x) => setPromoApplied(x);

  useEffect(() => {
    if (localStorage.getItem("cart")) {
      setCartItems(JSON.parse(localStorage.getItem("cart")));
    }
  }, []);

  const clearCart = () => {
    setCartItems({});
    localStorage.removeItem("cart"); // Clears cart from localStorage
  };

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const contextValue = {
    food_list,
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    removeAllFromCart,
    clearCart,
    getTotalCartAmount,
    token,
    setToken,
    email,
    setEmail,
    promoApplied,
    applyPromoC,
    loading,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
