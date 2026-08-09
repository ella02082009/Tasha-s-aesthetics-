import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import axios from 'axios';

// 1. Dynamic API Base URL
const API_BASE_URL = process.env.VITE_API_URL || 'https://tasha-s-aesthetics.onrender.com';

const Cart = () => {
  const { cart, totalPrice, removeFromCart } = useCart();
  const [deliveryLocation, setDeliveryLocation] = useState('abuad');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  
  const deliveryFee = deliveryLocation === 'abuad' ? 0 : 2500;
  const checkoutTotal = totalPrice + deliveryFee;

  const handleCheckout = async () => {
    // Basic Form Validation
    if (!name.trim() || !email.trim()) {
      alert("Please enter your name and email address before proceeding to checkout.");
      return;
    }

    try {
      // 1. Extract item properties safely
      const formattedOrderItems = cart.map((item) => {
        const productId = item._id || item.id || (item.product && (item.product._id || item.product.id));
        const productName = item.name || (item.product && item.product.name) || "Unnamed Item";
        const productPrice = item.price || (item.product && item.product.price) || 0;
        const productQty = item.qty || item.quantity || 1;

        if (!productId) {
          console.error("Could not find a valid MongoDB ObjectId for this item:", item);
        }

        return {
          name: productName,
          qty: Number(productQty),
          price: Number(productPrice),
          product: productId 
        };
      });

      const currentDeliveryFee = typeof deliveryFee !== 'undefined' ? deliveryFee : 0;

      // 2. Build order payload
      const orderPayload = {
        orderItems: formattedOrderItems,
        customerName: name,
        customerEmail: email,
        shippingAddress: {
          location: typeof deliveryLocation !== 'undefined' && deliveryLocation === 'abuad' 
            ? 'Inside ABUAD' 
            : 'Outside ABUAD',
        },
        itemsPrice: Number(totalPrice),
        shippingPrice: Number(currentDeliveryFee),
        totalPrice: Number(checkoutTotal),
        isPaid: false,
        isReady: false
      };

      console.log("Submitting order payload:", orderPayload);

      // 3. Post directly to live Render backend
      const saveOrderResponse = await axios.post(`${API_BASE_URL}/api/orders`, orderPayload);
      const createdOrderId = saveOrderResponse.data._id;

      // 4. Fire Paystack initialization request (using user's email and checkout total)
      const response = await axios.post(`${API_BASE_URL}/api/paystack/initialize`, {
        email: email, // 👈 Uses the email entered by user
        amount: checkoutTotal * 100, // 👈 Uses the full total (including delivery fee) in Kobo
        metadata: {
          orderId: createdOrderId,
          customerName: name
        }
      });

      // 5. Redirect user to Paystack payment gateway
      if (response.data && response.data.data && response.data.data.authorization_url) {
        window.location.href = response.data.data.authorization_url;
      } else {
        alert("Unable to generate payment link. Please try again.");
      }

    } catch (error) {
      if (error.response && error.response.data) {
        console.log("SERVER ERROR BREAKDOWN LOG:", error.response.data);
        alert(`Order processing failed: ${JSON.stringify(error.response.data.message || error.response.data)}`);
      } else {
        console.error("Order workflow execution context failed:", error);
        alert("Checkout failed. Check network status trace logs.");
      }
    }
  };

  return (
    <div className="container" style={{ padding: '50px 10%' }}>
      <h1>Your Shopping Cart</h1>
      {cart.length === 0 ? (
        <p>Your cart is empty. Start shopping!</p>
      ) : (
        <div className="cart-content">
          <div className="cart-items">
            {cart.map((item, index) => (
              <div key={item._id || index} className="cart-item" style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #ddd', padding: '10px 0' }}>
                <p>{item.name}</p>
                <p>₦{(item.price * (item.qty || item.quantity || 1)).toLocaleString()}</p>
                <button onClick={() => removeFromCart(item._id)} style={{ padding: '8px 15px', background: '#222', color: 'white', border: 'none', cursor: 'pointer' }}>Remove</button>
              </div>
            ))}
          </div>

          <div className="delivery-selection" style={{ marginTop: '20px', padding: '15px', background: '#f9f9f9', borderRadius: '6px' }}>
            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>Select Shipping Target:</label>
            <select 
              value={deliveryLocation} 
              onChange={(e) => setDeliveryLocation(e.target.value)}
              style={{ padding: '8px', width: '100%', borderRadius: '4px', border: '1px solid #ccc' }}
            >
              <option value="abuad">Inside ABUAD Campus (Free Delivery)</option>
              <option value="outside">Outside ABUAD Campus (+ ₦2,500)</option>
            </select>
          </div>

          <div className="quantity-controls" style={{ marginTop: '10px' }}>
            <span>Total Items: {cart.reduce((sum, item) => sum + (item.qty || item.quantity || 1), 0)}</span>
          </div>

          <div className="checkout-form" style={{ margin: '20px 0', display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '300px' }}>
            <h3>Checkout Details</h3>
            <input 
              type="text" 
              placeholder="Your Full Name" 
              value={name} 
              onChange={(e) => setName(e.target.value)}
              style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
              required
            />
            <input 
              type="email" 
              placeholder="Your Email Address" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
              required
            />
          </div>

          <div className="cart-summary" style={{ marginTop: '30px', textAlign: 'right' }}>
            <p style={{ margin: '4px 0' }}>Items Subtotal: ₦{totalPrice.toLocaleString()}</p>
            <p style={{ margin: '4px 0' }}>Delivery Surcharge: ₦{deliveryFee.toLocaleString()}</p>
            <hr style={{ borderColor: '#eee', margin: '10px 0' }} />
            <h3>Total: ₦{checkoutTotal.toLocaleString()}</h3>
            <button className="btn-primary" onClick={handleCheckout} style={{ marginTop: '20px', padding: '15px 30px', background: '#222', color: 'white', border: 'none', cursor: 'pointer' }}>
              Checkout 
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;