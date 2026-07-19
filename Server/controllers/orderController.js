const Order= require('../models/order');
const sendEmail = require('../utils/sendEmail');

exports.createOrder = async (req, res) => {
  try {
    const { customerName, customerEmail, orderItems, totalPrice } = req.body;

    const order = new Order({ customerName, customerEmail, orderItems, totalPrice });
    const savedOrder = await order.save();

    if (savedOrder) {
      // Wrap email logic in its own try-catch so an email error doesn't break checkout
      try {
        await sendEmail({
          email: order.customerEmail,
          subject: "Order Received Tasha's Aesthetics",
          message: `Hi ${order.customerName}, Thank you for patronising us!`,
        });

        await sendEmail({
          email: process.env.EMAIL_USER,
          subject: "New Order Alert",
          message: `New order # ${order._id} from ${order.customerName}.`,
        });
        console.log("Notification emails sent successfully.");
      } catch (emailError) {
        // If credentials fail, log it in the terminal but DO NOT crash the checkout response!
        console.error("Nodemailer Auth Error: Notification emails skipped.", emailError.message);
      }

      // CRITICAL: This line will now run no matter what, sending the success back to React!
      return res.status(201).json(savedOrder);
    }
  } catch (error) {
    console.error("Order creation database failure:", error);
    return res.status(500).json({ message: "Server error creating order record." });
  }
};

exports.getOrders = async (req,res) =>{
    try{
        const orders = await Order.find({});
        res.json(orders);
    }catch(error){
        res.status(500).json({message:"server Error"});
    }
};