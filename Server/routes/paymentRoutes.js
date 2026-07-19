const express = require('express');
const router = express.Router();
const axios = require('axios');

router.get('/verify/:reference',async (req, res) => {
    const { reference } = req.params;

    try{
        const response = await axios.get(`https://api.paystack.co/transaction/verify/${reference}`, {
            headers: {
                Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
            }
        });
        
        const { status,data} = response.data;
        if(status && data.status ==='success'){
        res.status(200).json({message:"Payment verified successfully",data});
    } else{
        res.status(400).json({message:"Payment not successful",data});
    }
    } catch (error) {
        console.error("Payment verification error:", error.response ? error.response.data : error.message);
        res.status(500).json({ message: "Payment verification failed", error: error.response ? error.response.data.message : error.message });
    } 
});
router.post('/initialize', async (req, res) => {
    if (!req.body||!req.body.email||!req.body.amount){
        return res.status(400).json({message:"Please provide email and amount"});
    }
    const { email, amount } = req.body;
    try {
        const response = await axios.post('https://api.paystack.co/transaction/initialize', 
            {
                email,
                amount: amount * 100,
                split_code: process.env.PAYSTACK_SPLIT_CODE,
                callback_url: 'http://localhost:3000/verify-payment'//wherre to redirect after payment, use live url later
            },
    {
        headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
            'Content-Type': 'application/json'
        }
    }
        );
    
        res.status(200).json(response.data);
    } catch (error) {
        console.error("Payment initialization error:", error.response ? error.response.data : error.message);
        res.status(500).json({ message: "Payment initialization failed", error: error.response ? error.response.data.message : error.message });
  }
});

module.exports = router;
