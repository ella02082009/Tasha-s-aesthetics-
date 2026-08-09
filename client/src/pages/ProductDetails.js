import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import '../styles/global.css';

// 1. Dynamic API Base URL (Uses Render live server in production)
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://tasha-s-aesthetics-.onrender.com';

const ProductDetail = () => {
  const { id } = useParams(); 
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [name, setName] = useState('');
  const { addToCart } = useCart();

  useEffect(() => {
    // 2. Updated API call to live Render URL
    axios.get(`${API_BASE_URL}/api/products/${id}`)
      .then(res => { 
        setProduct(res.data);
        setLoading(false);
      })
      .catch(err => { 
        console.error("Error fetching product details:", err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="loader">Loading details...</div>;
  if (!product) return <div className="error">Product not found.</div>;

  // 3. Safe Image URL Extraction (Handles Cloudinary URLs & fallbacks smoothly)
  const rawImage = Array.isArray(product?.image) ? product.image[0] : product?.image;
  const finalImageUrl = rawImage
    ? (rawImage.startsWith('http')
        ? rawImage
        : `${API_BASE_URL}/${rawImage.replace(/\\/g, '/')}`)
    : 'https://via.placeholder.com/400';

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const reviewData = {
        rating: Number(rating), 
        comment: comment, 
        name: name || "Anonymous Client"
      };

      // 4. Updated review target URL to live Render URL
      const targetUrl = `${API_BASE_URL}/api/products/${id.id || id}/reviews`;
      await axios.post(targetUrl, reviewData);
      alert('Thank you for your review!');
      window.location.reload(); 
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  return (
    <div className="product-detail-container">
      <img 
        src={finalImageUrl} 
        alt={product?.name || "Product"} 
        style={{ width: '100%', height: 'auto', borderRadius: '8px' }} 
        className="product-detail-container-img"
      />
      <div className="product-detail-info">
        <h1>{product?.name}</h1>
        <p className="product-price">₦{product?.price?.toLocaleString()}</p>
        <p className="product-description">{product?.description}</p>
        <button className="add-to-cart-btn" onClick={() => addToCart(product)}>
          Add to Cart
        </button>
      </div>

      <div className="reviews-section">
        <form onSubmit={submitHandler} className="review-form">
          <h3>Leave a Review</h3>
          <div className="form-group">
            <label htmlFor="rating">Rating:</label>
            <select id="rating" value={rating} onChange={(e) => setRating(e.target.value)} required>
              <option value="">Select Rating</option>
              <option value="1">1 - Poor</option>
              <option value="2">2 - Fair</option>
              <option value="3">3 - Good</option>
              <option value="4">4 - Very Good</option>
              <option value="5">5 - Excellent</option>
            </select>
          </div>
          <div className="form-group">
            <textarea
              placeholder="Write your reviews here..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <button type="submit" className='submit-review-btn'>Submit Review</button>
        </form>

        <div className="product-reviews-list" style={{ marginTop: '30px' }}>
          <h3>Customer Reviews ({product.reviews ? product.reviews.length : 0})</h3>
          
          {!product.reviews || product.reviews.length === 0 ? (
            <p>No reviews yet. Be the first to leave a review!</p>
          ) : (
            product.reviews.map((review, index) => (
              <div key={review._id || index} className="review-card" style={{ padding: '15px', borderBottom: '1px solid #eee', marginBottom: '10px' }}>
                <strong style={{ display: 'block', color: '#333' }}>
                  {review.name || (review.user && review.user.name) || "Anonymous Client"}
                </strong>
                
                <span style={{ color: '#f4a261' }}>
                  {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
                </span>
                
                <p style={{ margin: '8px 0 0 0', color: '#555' }}>{review.comment}</p>
                <small style={{ color: '#999', display: 'block', marginTop: '5px' }}>
                  {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : 'Recent'}
                </small>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;