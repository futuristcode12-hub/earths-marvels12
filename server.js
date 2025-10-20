const express = require('express');
const path = require('path');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Email transporter setup
const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Test email configuration
transporter.verify((error, success) => {
  if (error) {
    console.log('❌ Email configuration error:', error);
  } else {
    console.log('✅ Email server is ready to send messages');
  }
});

// Contact form route
app.post('/contact', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({ 
        success: false, 
        message: 'All fields are required.' 
      });
    }

    // Email content
    const mailOptions = {
      from: email,
      to: process.env.EMAIL_USER,
      subject: `New Contact Form Message from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2c5530;">New Contact Form Submission</h2>
          <div style="background: #f5f9f5; padding: 20px; border-radius: 10px;">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Message:</strong></p>
            <div style="background: white; padding: 15px; border-radius: 5px; margin-top: 10px;">
              ${message.replace(/\n/g, '<br>')}
            </div>
          </div>
          <p style="color: #666; margin-top: 20px;">
            Sent from Earth's Marvels Website
          </p>
        </div>
      `
    };

    // Send email
    await transporter.sendMail(mailOptions);
    
    console.log('✅ Contact form email sent successfully');
    res.json({ 
      success: true, 
      message: 'Thank you! Your message has been sent successfully.' 
    });
    
  } catch (error) {
    console.error('❌ Email error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Sorry, there was an error sending your message. Please try again.' 
    });
  }
});

// Newsletter subscription route
app.post('/subscribe', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email address is required.' 
      });
    }

    // Email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please enter a valid email address.' 
      });
    }

    // Newsletter email content
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: 'New Newsletter Subscription',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2c5530;">🎉 New Newsletter Subscriber!</h2>
          <div style="background: #f5f9f5; padding: 20px; border-radius: 10px;">
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
            <p><strong>Time:</strong> ${new Date().toLocaleTimeString()}</p>
          </div>
          <p style="color: #666; margin-top: 20px;">
            New subscriber from Earth's Marvels Website
          </p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    
    console.log('✅ Newsletter subscription recorded');
    res.json({ 
      success: true, 
      message: 'Thank you for subscribing to our newsletter!' 
    });
    
  } catch (error) {
    console.error('❌ Subscription error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Subscription failed. Please try again.' 
    });
  }
});

// Serve HTML pages
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/wonders', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'wonders.html'));
});

app.get('/gallery', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'gallery.html'));
});

app.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'about.html'));
});

app.get('/contact', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'contact.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📧 Email user: ${process.env.EMAIL_USER ? 'Configured' : 'Not configured'}`);
});