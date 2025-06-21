/*****************************************************************
 *  Kalorien-Backend – gửi e-mail BMR/TDEE
 *****************************************************************/

 // 👉 Chỉ nạp dotenv khi CHẠY LOCAL (không có NODE_ENV=production)
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();          // npm install dotenv  (chạy 1 lần ở local)
}

const express     = require('express');
const path        = require('path');
const nodemailer  = require('nodemailer');

const app  = express();
const port = process.env.PORT || 3000;

/* ---------- Middleware ---------- */
app.use(express.json());              // đọc JSON body
app.use(express.static(__dirname));   // phục vụ index.html, app.js, CSS, ảnh…

/* ---------- Trang chủ ---------- */
app.get('/', (_, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

/* ---------- Cấu hình Gmail ---------- */
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,      // lấy từ .env (local) HOẶC Environment Vars (Render)
    pass: process.env.GMAIL_APP_PASS,  // app-password 16 ký tự
  },
});

/* ---------- API gửi mail ---------- */
app.post('/api/send-email', (req, res) => {
  const { email, bmr, tdee } = req.body;

  const mailOptions = {
    from: process.env.GMAIL_USER,
    to:   email,
    subject: 'Dein BMR & TDEE Ergebnis',
    html: `<p><b>BMR:</b> ${bmr} kcal<br><b>TDEE:</b> ${tdee} kcal</p>`,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.error('❌ Fehler beim Senden:', err);
      return res.status(500).json({ success: false });
    }
    console.log('✅ Email gesendet:', info.response);
    res.json({ success: true });
  });
});

/* ---------- Khởi động server ---------- */
app.listen(port, () => {
  console.log(`🚀 Server läuft auf http://localhost:${port}`);
  console.log('📧 GMAIL_USER =', process.env.GMAIL_USER ?? 'undefined');
});
