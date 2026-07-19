import React, {useEffect,useState} from 'react';
import axios from 'axios';

const AdminOrders = () => {
    const[orders, setOrders]= useState([]);

    useEffect(()=>{
        const fetchOrders = async() =>{
            // eslint-disable-next-line no-unused-vars
            try{
                const response = await axios.get('http://localhost:5000/api/orders');
                setOrders(response.data);
            }catch(err){
                console.error(err);
            }
        };
        fetchOrders();
    },[]);

    const markAsReady = async (id)=>{
        try{
            await axios.put(`http://localhost:5000/api/orders/${id}/notify`);
            alert('customer notified!');

            setOrders(orders.map(o=>o._id===id?{...o,isReady:true}:o));
        }catch(err){
            console.error(err);
        }
    };
    
    return(
        <div className="admin-orders-container" style={{ padding: '40px 10%', minHeight: '60vh' }}>
            <h2>Customer Orders</h2>
            {orders.length === 0 ? (
        <p style={{ marginTop: '20px', color: '#666' }}>No orders have been recorded yet.</p>
      ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #333', paddingBottom: '10px' }}>
              <th style={{ padding: '12px' }}>ID</th>
              <th style={{ padding: '12px' }}>Customer</th>
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
                <td style={{ padding: '12px' }}>₦{(order.totalPrice || 0).toLocaleString()}</td>
                <td style={{ padding: '12px' }}>{order.isReady ? "Ready" : "Processing"}</td>
                <td>{order.orderItems.map(item => item.name).join(", ")}</td>
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
                      style={{ padding: '6px 12px', cursor: 'pointer', fontSize: '13px' }}
                    >
                      Notify Pickup
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminOrders;