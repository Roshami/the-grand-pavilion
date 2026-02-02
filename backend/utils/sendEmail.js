const nodemailer = require('nodemailer');

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// Send email function
const sendEmail = async (options) => {
  try {
    const mailOptions = {
      from: `"The Grand Pavilion" <${process.env.SMTP_FROM_EMAIL}>`,
      to: options.email,
      subject: options.subject,
      text: options.message,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
          <div style="text-align: center; padding-bottom: 20px; border-bottom: 2px solid #8B0000;">
            <h1 style="color: #8B0000; margin: 0;">The Grand Pavilion</h1>
            <p style="color: #666; margin: 5px 0 0 0;">Where Every Moment Becomes a Celebration</p>
          </div>
          
          <div style="padding: 20px 0;">
            <p style="font-size: 16px; line-height: 1.6; color: #333;">
              ${options.message.replace(/\n/g, '<br>')}
            </p>
          </div>
          
          <div style="padding-top: 20px; border-top: 1px solid #ddd; text-align: center; color: #666; font-size: 14px;">
            <p style="margin: 5px 0;">📞 +94 11 234 5678</p>
            <p style="margin: 5px 0;">📧 info@grandpavilion.lk</p>
            <p style="margin: 5px 0;">📍 123 Main Street, Colombo</p>
          </div>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    
    console.log('Email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

module.exports = sendEmail;