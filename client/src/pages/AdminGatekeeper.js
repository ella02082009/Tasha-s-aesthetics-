import React, { useState } from 'react';
import Admin from '../pages/Admin'; 
import '../styles/global.css'; 
const AdminGatekeeper = () => {
  const [password, setPassword] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);

  // The secret key 
  const ADMIN_KEY = "TashaAdmin2026"; 

  const handleUnlock = (e) => {
    e.preventDefault();
    if (password === ADMIN_KEY) {
      setIsAuthorized(true);
    } else {
      alert("Incorrect Key. Access Denied.");
    }
  };

  // If authorized, show the Admin form. 
  return (
    <div className="gatekeeper-container">
      {isAuthorized ? (
        <Admin adminKey={password} />
      ) : (
        <div className="lock-screen">
          <h2>Tasha Aesthetics Admin</h2>
          <form onSubmit={handleUnlock}>
            <input 
              type="password" 
              placeholder="Enter Admin Secret Key" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="admin-input"
            />
            <button type="submit" className="admin-btn">Unlock Dashboard</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminGatekeeper;