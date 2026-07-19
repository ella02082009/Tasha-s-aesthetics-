import React, { createContext, useState, useContext, useEffect } from 'react';

// 1. Create the Context
const CartContext = createContext();

// 2. Create the Provider Component
export const CartProvider = ({ children }) => {
  // Initialize cart from localStorage so items stay even if the page refreshes
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('tasha_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Save to localStorage whenever the cart changes
  useEffect(() => {
    localStorage.setItem('tasha_cart', JSON.stringify(cart));
  }, [cart]);

  // Function to add item to cart
  const addToCart = (product) => {
    setCart((prevCart) => {
      // Check if item already exists to avoid duplicates (optional)
      const existingItem = prevCart.find(item => item._id === product._id);
      if (existingItem) {
        return prevCart.map(item =>
          item._id === product._id ? { ...item, quantity: (item.quantity || 1) + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  // Function to remove item
  const removeFromCart = (productId) => {
    if (!productId) {
      console.error("Error: No ID was passed to removeFromCart");
      return;
    }
    setCart((prevCart) => prevCart.filter(item => item._id !== productId));
  };

  // Function to clear cart (call this after successful Paystack payment)
  const clearCart = () => setCart([]);

  // Calculate total price dynamically
  const totalPrice = cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
};

// 3. Create a custom hook for easy access
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};