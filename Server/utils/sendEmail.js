const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth:{
            user:process.env.EMAIL_USER,
            pass:process.env.EMAIL_PASS,
        }
    });

  const sendEmail = async (options) =>{
    const mailOptions={
        from:`Tashas Aesthetics <$ {process.env.EMAI_USER}>`,
        to:options.email,
        subject:options.subject,
        text:options.message,
    };
    await transporter.sendMail(mailOptions);
};
   const sendOrderEmails = async (order, customerEmail) => {
  // 1. Email to Brand Owner
  await transporter.sendMail({
    to: process.env.EMAIL_USER,
    subject: `New Order Received - #${order._id}`,
    html: `<h3>New Order!</h3><p>Customer: ${order.customerName}</p><p>Total: ₦${order.totalPrice}</p>`
  });

  // 2. Email to Customer
  await transporter.sendMail({
    to: customerEmail,
    subject: "Order Confirmed - Tasha's Aesthetics",
    html: `<h3>Thank you for your order!</h3><p>We are processing it now. We will alert you when it's ready for pickup.</p>`
  });
};

module.exports={ sendEmail, sendOrderEmails };
