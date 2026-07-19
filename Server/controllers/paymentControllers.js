const axios = require('axios');

exports.initializePayment = async (req, res) => {
    const { email, amount } = req.body;
    try {
            console.log("DEBUG: The secret key being sent to Paystack is:", process.env.PAYSTACK_SECRET_KEY);
        const key = process.env.PAYSTACK_SECRET_KEY;
        const response = await axios.post('https://api.paystack.co/transaction/initialize', 
            {
                email,
                amount: amount * 100,
                split_code: process.env.PAYSTACK_SPLIT_CODE,
                callback_url: 'http://localhost:3000/payment/callback'//use live url later
            },
    {
        headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
            'Content-Type': 'application/json'
        }
    }
        );
        res.status(200).json(response.data.data);
    } catch (error) {
        res.status(500).json({ message: "Payment initialization failed", error: error.message});
  }
};