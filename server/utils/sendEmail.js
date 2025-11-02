const nodemailer = require('nodemailer');

const sendEmail = async (email, subject, htmlContent) => {
  try {
    // Basic env validation to give clearer errors when mail settings are misconfigured
    const { EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS } = process.env;

    if (!EMAIL_USER || !EMAIL_PASS) {
      const msg = 'EMAIL_USER and EMAIL_PASS must be set in environment to send email.';
      console.error('Email config error:', msg);
      return { success: false, error: msg };
    }

    if (!EMAIL_HOST) {
      // If host is missing but EMAIL_USER looks like gmail, suggest smtp.gmail.com
      if (EMAIL_USER && EMAIL_USER.endsWith('@gmail.com')) {
        console.warn('EMAIL_HOST not set — for Gmail use smtp.gmail.com');
      } else {
        console.error('EMAIL_HOST is not set in environment');
        return { success: false, error: 'EMAIL_HOST not configured' };
      }
    }

    // Common misconfiguration: user accidentally set EMAIL_HOST to their email address
    if (EMAIL_HOST && EMAIL_HOST.includes('@')) {
      const msg = 'EMAIL_HOST appears to be an email address. Set EMAIL_HOST to your SMTP host (e.g. smtp.gmail.com) and set EMAIL_USER to your email address.';
      console.error('Email config error:', msg, 'EMAIL_HOST=', EMAIL_HOST);
      return { success: false, error: msg };
    }

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Pavakie Chat App" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: subject,
      html: htmlContent,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: %s', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: error.message };
  }
};

const sendOTPEmail = async (email, otpCode) => {
  const subject = 'Verify Your Email - Pavakie Chat App';
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .container {
            background-color: #f8f7fc;
            border-radius: 10px;
            padding: 30px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          .header {
            text-align: center;
            color: #7B42F6;
            margin-bottom: 30px;
          }
          .otp-box {
            background-color: #7B42F6;
            color: white;
            font-size: 32px;
            font-weight: bold;
            text-align: center;
            padding: 20px;
            border-radius: 8px;
            margin: 30px 0;
            letter-spacing: 5px;
          }
          .footer {
            text-align: center;
            margin-top: 30px;
            color: #6B6B6B;
            font-size: 12px;
          }
          .warning {
            color: #EF4444;
            font-size: 14px;
            margin-top: 20px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1 class="header">Welcome to Pavakie Chat App!</h1>
          <p>Thank you for signing up. To complete your registration, please verify your email address using the OTP below:</p>
          
          <div class="otp-box">${otpCode}</div>
          
          <p>This OTP will expire in <strong>10 minutes</strong>.</p>
          
          <p class="warning">If you didn't create an account with Pavakie Chat App, please ignore this email.</p>
        </div>
        
        <div class="footer">
          <p>&copy; 2024 Pavakie Chat App. All rights reserved.</p>
        </div>
      </body>
    </html>
  `;

  return await sendEmail(email, subject, htmlContent);
};

module.exports = {
  sendEmail,
  sendOTPEmail
};

