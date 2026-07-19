const express=require('express');
const router=express.Router();
const { createOrder, getOrders }= require('../controllers/orderController');
const Order = require('../models/order');
const { sendEmail } = require('../utils/sendEmail');

router.post('/',createOrder);
router.get('/',getOrders);


// Make sure the path matches exactly what frontend Line 22 is hitting!
router.put('/:id/notify', async (req, res) => {
    try {
        const orderId = req.params.id;
        console.log(`Notification route hit for order: ${orderId}`);

        const updatedOrder = await Order.findByIdAndUpdate(
            orderId,
            { status: 'Ready for Pickup' },
            { returnDocument: 'after' }
        );

        if (!updatedOrder) {
            return res.status(404).json({ message: "Order document not found." });
        }

        // 🌟 Read the exact keys verified by your terminal log
        const recipientEmail = updatedOrder.customerEmail;
        const recipientName = updatedOrder.customerName || "Valued Customer";

        console.log(`Sending email to: ${recipientEmail}`);

        // 🌟 FIX: Pass options as a single configuration object 
        // to match your utility's exact configuration properties
        await sendEmail({
            email: recipientEmail,
            subject: "Your Order is Ready for Pickup! 🌟 - Tasha's Aesthetics",
            message: `Hi ${recipientName},\n\nGreat news! Your order #${orderId} is officially ready for pickup at Tasha's Aesthetics.`
        });

        console.log(`Notification trigger successful for order: ${orderId}`);

        return res.status(200).json({ 
            success: true, 
            message: "Customer notification email dispatched successfully!",
            order: updatedOrder 
        });

    } catch (error) {
        console.error("Notification Route Failure:", error.message);
        return res.status(500).json({ message: "Internal server error notifying customer." });
    }
});
module.exports=router;