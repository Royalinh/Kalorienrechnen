require('dotenv').config();
const express = require('express');
const path = require('path');
const nodemailer = require('nodemailer');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(__dirname));

// Trang index
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Gửi email
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASS,
  }
});

app.post('/api/send-email', (req, res) => {
  const { email, bmr, tdee } = req.body;

  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: email,
    subject: 'Dein BMR und TDEE Ergebnis',
    html: `<p><b>BMR:</b> ${bmr} kcal<br><b>TDEE:</b> ${tdee} kcal</p>`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Lỗi khi gửi mail:', error);
      return res.status(500).json({ success: false });
    }
    res.json({ success: true });
  });
});

// Lắng nghe server
app.listen(port, () => {
  console.log(`🚀 Server läuft auf http://localhost:${port}`);
});