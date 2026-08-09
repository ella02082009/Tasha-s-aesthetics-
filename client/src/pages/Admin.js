import React, { useState } from 'react';
import axios from 'axios';
import '../styles/global.css'; 
import { Link } from 'react-router-dom';

// 1. Set dynamic API Base URL
const API_BASE_URL = process.env.VITE_API_URL || 'https://tasha-s-aesthetics.onrender.com';

const Admin = ({ adminKey }) => {
  const [product, setProduct] = useState({
    name: '', price: '', category: 'LipLiner', description: '', countInStock: '', image: ''
  });

  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedFile) {
      alert("Please select an image file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append('name', product.name);
    formData.append('price', product.price);
    formData.append('category', product.category);
    formData.append('description', product.description);
    formData.append('countInStock', product.countInStock);
    formData.append('image', selectedFile); // Key MUST match backend multer field name ('image')
    formData.append('secretKey', adminKey); 

    try {
      // 2. Post directly to live Render backend URL
      await axios.post(`${API_BASE_URL}/api/products/add`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      alert("Product successfully added to the store!");
    } catch (err) {
      console.error("Admin Upload Error:", err.response?.data || err);
      alert(err.response?.data?.message || "Authorization failed on server. Product not added.");
    }
  };

  return (
    <form className="admin-form" onSubmit={handleSubmit}>
      <h3>Add New Product</h3>
      <div className="form-group">
        <label htmlFor="name">Product Name</label>
        <input type="text" id="name" placeholder="Product Name" onChange={(e) => setProduct({...product, name: e.target.value})} required />
      </div>
      <div className="form-group">
        <label htmlFor="price">Price (₦)</label>
        <input type="number" id="price" placeholder="Price (₦)" onChange={(e) => setProduct({...product, price: e.target.value})} required />
      </div>
      <div className="form-group">
        <label htmlFor="category">Category</label>
        <select id="category" onChange={(e) => setProduct({...product, category: e.target.value})}>
          <option value="LipLiner">Lip Liner</option>
          <option value="Lip gloss">Lip Gloss</option>
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="countInStock">Count In Stock</label>
        <input type="number" id="countInStock" placeholder="Count In Stock" onChange={(e) => setProduct({...product, countInStock: e.target.value})} required />
      </div>
      <div className="form-group">
        <label htmlFor="description">Product Description</label>
        <textarea id="description" placeholder="Product Description" onChange={(e) => setProduct({...product, description: e.target.value})} required />
      </div>
      <div className="form-group">
        <label htmlFor="image">Image</label>
        <input type="file" id="image" onChange={handleFileChange} accept="image/*" required />
      </div>
      <button type="submit" style={{ marginTop: '20px', padding: '15px 30px', background: '#222', color: 'white', border: 'none', cursor: 'pointer' }}>Upload Product</button>
      <Link to="/admin/orders" style={{ display: 'block', marginTop: '20px', textAlign: 'center', color: '#222' }}>
        View Orders
      </Link>
    </form>
  );
};

export default Admin;