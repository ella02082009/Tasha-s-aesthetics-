const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const productRoutes = require('./routes/productRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const orderRoutes = require('./routes/orderRoutes');
const Order = require('./models/order');

const { sendEmail } = require('./utils/sendEmail');
console.log("--- ORDER ROUTE CHECK --- Is sendEmail a function here?:", typeof sendEmail);
const app = express();
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'https://tasha-s-aesthetics-frontend.vercel.app', // Replace with your exact Vercel URL
];
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));
//ROUTES
app.use('/api/products', productRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/orders', orderRoutes);

const PORT = process.env.PORT || 5000;
const axios = require('axios');
app.post('/api/paystack/initialize', async (req, res) => {
  try {
    const { email, amount, metadata } = req.body;
    
    // We hardcode your secret key directly here to bypass any .env loading bugs
    const response = await axios.post(
      'https://api.paystack.co/transaction/initialize',
      { email, amount, metadata,
        callback_url: 'http://localhost:3000/order-success'
       },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`, // Put your real sk_test_ key string here
          'Content-Type': 'application/json'
        }
      }
    );
    return res.json(response.data);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Handshake Error" });
  }
});


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));