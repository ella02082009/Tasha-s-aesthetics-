import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="logo">
        <h2 style={{margin: 0}}>TASHA's AESTHETICS</h2>
      </div>
      <div className="links">
        <Link to="/Home" style={{marginRight: '20px', textDecoration: 'none', color: 'inherit'}}>Home</Link>
        <Link to="/Cart" style={{textDecoration: 'none', color: 'inherit'}}>Cart </Link>
        <Link to="/Shop" style={{textDecoration: 'none', color: 'inherit', marginLeft: '20px',}}>Shop</Link>
      </div>
    </nav>
  );
};

export default Navbar;