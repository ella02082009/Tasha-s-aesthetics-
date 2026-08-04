import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../styles/global.css'; 
import { useCart } from '../context/CartContext';


const Shop = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const { addToCart } = useCart();
 
  useEffect(() => {
    // Fetching all products from your backend
    axios.get('http://localhost:5000/api/products')
      .then(res => {
      setProducts(res.data);
      // 🌟 DIAGNOSTIC LOG: Print the products to your browser inspector!
      console.log("FRONTEND RECEIVED PRODUCTS:", res.data);
    })
    .catch(err => console.log("Check your connection:", err));
}, []);
  


  const filteredProducts = Array.isArray(products)&&products.filter(p => 
    (activeCategory === "All" || p.category === activeCategory) &&
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="shop-container">
      {/* Search Bar */}
      <div className="search-box">
        <input 
          type="text" 
          className="search-box-input"
          placeholder="Search for beauty..." 
          onChange={(e) => setSearchTerm(e.target.value)} 
        />
      </div>

      {/* Category buttons */}
      <div className="filter-button-group">
          {["All", "LipLiner","LipGloss"].map((cat)=>(
            <button key={cat} className={`filter-btn${activeCategory===cat? 'active':''}`} onClick={()=>
              setActiveCategory(cat)
            }>{cat}</button>
          ))}
      </div>

      {/* Product Grid */}  
      <div className="product-grid">
        {Array.isArray(products) && filteredProducts.map(product => {
          const productId = product._id;
          // 1. Your exact existing image variable:
          const rawImage = (Array.isArray(product.image) && product.image.length > 0)
            ? product.image[0]
            : (product.imageUrl || product.image || "https://placehold.co/300x300?text=No+Image");

          // 2. The fail-safe HTTPS converter:
          const imageSrc = typeof rawImage === 'string' && rawImage.includes('http://localhost:5000')
            ? rawImage.replace('http://localhost:5000', import.meta.env.VITE_API_URL || 'https://tasha-s-aesthetics-.onrender.com')
            : rawImage;
        
          return (
            <Link to={`/product/${productId}`} key={productId} className="product-card-link">
              <div className="product-card">
                <img src={imageSrc}
                  alt={product.name || 'Product image'}
                  className="product-image"
                  onError={(e) => { e.target.src = 'https://placehold.co/300x300?text=No+Image'; }}
                />
                <h4>{product.name}</h4>
                <p>₦{product.price.toLocaleString()}</p>
                <button className='add-btn' onClick={(e) => { e.preventDefault(); e.stopPropagation(); addToCart(product); }}>Add to cart</button>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Shop;