import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import '../styles/global.css';

const ProductDetail = () => {
  const { id } = useParams(); 
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [name, setName] = useState('');
  const { addToCart } = useCart();
  useEffect(() => {
    // Fetching only ONE product by its ID
    axios.get(`http://localhost:5000/api/products/${id}`)
      .then(res =>{ setProduct(res.data);
                  setLoading(false);
      })
      .catch(err =>{ console.error("Error fetching product details:", err);
                    setLoading(false);
                  });
  }, [id]);

  if (loading) return <div className="loader">Loading details...</div>;
  if (!product) return <div className="error">Product not found.</div>;

  // 1. Safe extraction: gets string whether image is an array or raw string
  const imagePath = Array.isArray(product?.image) ? product.image[0] : product?.image;

  // 2. Clear, explicit URL formatting without multiline layout bugs
  const finalImageUrl = imagePath
    ? (imagePath.startsWith('http')
        ? imagePath
        : `http://localhost:5000/${imagePath.replace(/\\/g, '/')}`)
    : 'https://via.placeholder.com/400'; // Fail-safe placeholder if no image exists

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const reviewData = {
         rating: Number(rating), 
         comment:comment, 
         name:name || "Anonymous Client"
        };
      const targetUrl = `http://localhost:5000/api/products/${id.id || id}/reviews`;
     await axios.post(targetUrl, reviewData);
      alert('Thank you for your review!');
     window.location.reload(); // Refresh to show the new review
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  return (
    <div className="product-detail-container">
        <img src={finalImageUrl} alt={product?.name || "Product"} style={{ width: '100%', height: 'auto', borderRadius: '8px' }} className="product-detail-container-img"/>
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
              <option value="1">1 -Poor</option>
              <option value="2">2-Fair</option>
              <option value="3">3-Good</option>
            <option value="4">4-Very Good</option>
            <option value="5">5-Excellent</option>
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
          <button type="submit"className='submit-review-btn'>Submit Review</button>
        </form>
        <div className="product-reviews-list" style={{ marginTop: '30px' }}>
  <h3>Customer Reviews ({product.reviews ? product.reviews.length : 0})</h3>
  
  {/* If there are no reviews, show a fallback message */}
  {!product.reviews || product.reviews.length === 0 ? (
    <p>No reviews yet. Be the first to leave a review!</p>
  ) : (
    product.reviews.map((review, index) => (
      <div key={review._id || index} className="review-card" style={{ padding: '15px', borderBottom: '1px solid #eee', marginBottom: '10px' }}>
        {/* SAFE ENTRY: Fallback to name or Anonymous Client */}
        <strong style={{ display: 'block', color: '#333' }}>
          {review.name || (review.user && review.user.name) || "Anonymous Client"}
        </strong>
        
        {/* Render Rating stars or numbers */}
        <span style={{ color: '#f4a261' }}>{"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}</span>
        
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