// In CartProvider

import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "../Utils/axios.jsx";
import { useAuth } from "./AuthContext.jsx";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const fetchCart = async () => {
    try {
      const res = await axios.get("/cart");

      setCartItems(res.data);
    } catch (err) {
      console.log("Failed to fetch cart:", err);
    }
  };

  // Fetch cart only if the user is logged in and token is available

  const addToCart = async (ProductID, quantity = 1) => {
    console.log("cartContext", ProductID, quantity);
    try {
      const res = await axios.post("/cart", {
        product_id: ProductID,
        quantity,
      });
    } catch (err) {
      console.log("Failed to add to cart:", err);
    }
  };

  const updateCart = async (productId, quantity) => {
    try {
      await axios.put(`/cart/${productId}`, {
        product_id: productId,
        quantity,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const removeItem = async (productId) => {
    try {
      axios.delete(`/cart/${productId}`, {
        data: { product_id: productId },
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <CartContext.Provider
      value={{ fetchCart, cartItems, addToCart, updateCart, removeItem }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
