import React from 'react';

const Footer = () => {
  return (
    <footer style={{ backgroundColor: '#fff', borderTop: '1px solid #eee', padding: '50px 10%', marginTop: '100px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
        <div>
          <h2 style={{ letterSpacing: '2px' }}>TASHA'S Aesthetics</h2>
          <p style={{ color: '#666', maxWidth: '250px' }}>High-quality beauty products for your daily routine.</p>
        </div>
        <div>
          <h4>Quick Links</h4>
          <ul style={{ listStyle: 'none', padding: 0, color: '#666' }}>
            <li><a href="/Shop" style={{ color: '#666', textDecoration: 'none' }}>Shop Now</a></li>
            <li><a href="/Home" style={{ color: '#666', textDecoration: 'none' }}>Products</a></li>
            <li><a href="/Cart" style={{ color: '#666', textDecoration: 'none' }}>Cart</a></li>
          </ul>
        </div>
        <div>
          <h4>Contact</h4>
          <p style={{ color: '#666' }}>Snapchat:@hotgirltashaa</p>
          <p style={{ color: '#666' }}>+234 815 531 7850</p>
        </div>
      </div>
      <div style={{ textAlign: 'center', marginTop: '40px', borderTop: '1px solid #f9f9f9', paddingTop: '20px', fontSize: '12px', color: '#999' }}>
        © 2026 Tasha's Aesthetics. All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;