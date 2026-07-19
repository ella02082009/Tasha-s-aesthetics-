// Server/middleware/authMiddleware.js
const protect = async (req, res, next) => {
  // For development, if you don't have tokens working yet, 
  // we will inject a fallback mock user so the database has an ID to bind the review to.
  req.user = {
    _id: "66769f3b1f4d2a0017e1a2b3", // A standard MongoDB Object ID format
    name: "Test User"
  };
  next();
};

module.exports = { protect };