import React, { useState } from 'react';
import '../styles/global.css';
import'../components/Footer';


const Home = ()=> {
const [products] = useState([
    { id: 2, name: 'TASHAS FLAMINGO PINK', price: 8500, image: 'product1.png' },
    { id: 3, name: 'ANNASTASIA', price: 5500, image: 'product3.png' },
]);

return (
    <div className ="home-container">
        <section className="hero" style={{ backgroundImage: 'url(/hero-image.jpg)' }}> 
            <div className="hero-content">
                <h1 style={{color: 'black'}}>Welcome to Tasha's Aesthetics</h1>
                <p style={{color: 'black'}}>Your one-stop shop for all things beauty .</p>
              <a href="/shop"><button className="btn-primary">Shop Now</button></a>  
            </div>
        </section>

        {/*Product Grid*/}
        <h2 style={{ textAlign: 'center', marginTop: '2rem' }}>Our  Hand-Picked Products</h2>
        <div className="product-grid">
           {products.map((product) => (
                <div className="card" key={product.id}>
                    <img src={product.image} alt={product.name} className="product-image"/>
                    <h3>{product.name}</h3>
                    <p>₦{product.price.toLocaleString()}</p>
                    
                </div>
            ))}
             
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', margin: '2rem 0' }}>
            <a href="/shop"><button className="btn-primary"style={{ margin: '1rem', display:'flex', alignItems:'center', justifyContent:'center'}}>See More</button></a> 
    </div>
    </div> 
);
};
 export default Home;