import React, { useEffect, useState } from 'react';
import axios from 'axios';

// 1. Dynamic API Base URL
const API_BASE_URL = process.env.VITE_API_URL || 'https://tasha-s-aesthetics.onrender.com';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // 2. Fetch directly from live Render backend
        const response = await axios.get(`${API_BASE_URL}/api/orders`);
        setOrders(response.data);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      }
    };
    fetchOrders();
  }, []);

  const markAsReady = async (id) => {
    try {
      // 3. Update order directly on live Render backend
      await axios.put(`${API_BASE_URL}/api/orders/${id}/notify`);
      alert('Customer notified!');

      setOrders(orders.map(o => o._id === id ? { ...o, isReady: true } : o));
    } catch (err) {
      console.error("Failed to update order status:", err);
      alert("Failed to send notification. Check console logs.");
    }
  };

  return (
    <div className="admin-orders-container" style={{ padding: '40px 10%', minHeight: '60vh' }}>
      <h2>Customer Orders</h2>
      {orders.length === 0 ? (
        <p style={{ marginTop: '20px', color: '#666' }}>No orders have been recorded yet.</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #333', paddingBottom: '10px' }}>
                <th style={{ padding: '12px' }}>ID</th>
                <th style={{ padding: '12px' }}>Customer</th>
                <th style={{ padding: '12px' }}>Items</th>
                <th style={{ padding: '12px' }}>Total</th>
                <th style={{ padding: '12px' }}>Status</th>
                <th style={{ padding: '12px' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '12px' }}>{order._id ? order._id.substring(0, 5) : 'N/A'}...</td>
                  <td style={{ padding: '12px' }}>{order.customerName || "Guest"}</td>
                  <td style={{ padding: '12px' }}>
                    {order.orderItems && order.orderItems.length > 0 
                      ? order.orderItems.map(item => item.name).join(", ") 
                      : "No items"}
                  </td>
                  <td style={{ padding: '12px' }}>₦{(order.totalPrice || 0).toLocaleString()}</td>
                  <td style={{ padding: '12px' }}>
                    <span style={{ 
                      padding: '4px 8px', 
                      borderRadius: '4px', 
                      backgroundColor: order.isReady ? '#e8f5e9' : '#fff3e0',
                      color: order.isReady ? '#2e7d32' : '#ef6c00',
                      fontSize: '14px',
                      fontWeight: 'bold'
                    }}>
                      {order.isReady ? "Ready for Pickup" : "Processing"}
                    </span>
                  </td>
                  <td style={{ padding: '12px' }}>
                    {!order.isReady && (
                      <button 
                        onClick={() => markAsReady(order._id)}
                        className="btn-primary"
                        style={{ padding: '6px 12px', cursor: 'pointer', fontSize: '13px', background: '#222', color: '#fff', border: 'none', borderRadius: '4px' }}
                      >
                        Notify Pickup
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;