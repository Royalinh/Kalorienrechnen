const express = require('express');
const path = require('path');
const nodemailer = require('nodemailer');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(__dirname));

// Gửi HTML khi truy cập trang chính
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Gửi Email
app.post('/api/send-email', (req, res) => {
  const { email, bmr, tdee } = req.body;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASS,
    },
  });

  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: email,
    subject: 'Dein BMR und TDEE Ergebnis',
    html: `<p><b>BMR:</b> ${bmr} kcal<br><b>TDEE:</b> ${tdee} kcal</p>`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('❌ Fehler beim Senden:', error);
      return res.status(500).json({ success: false });
    }
    res.json({ success: true });
  });
});

app.listen(port, () => {
  console.log(`🚀 Server läuft auf http://localhost:${port}`);
});
