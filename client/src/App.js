import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from'./components/Footer';
import Home from './pages/Home';
import Shop from './pages/Shop';
import Cart from './pages/Cart';
import './styles/global.css'; 
import AdminGatekeeper from './pages/AdminGatekeeper';
import ProductDetail from './pages/ProductDetails';
import AdminOrders from './pages/adminOrders';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/Home" element={<Home />} />
        <Route path="/Shop" element={<Shop />} />
        <Route path="/Cart" element={<Cart />} />
        <Route path="/admin" element={<AdminGatekeeper />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/admin/orders" element={<AdminOrders/>}/>
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;

