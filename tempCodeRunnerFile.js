const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 3000;

app.use(express.static(__dirname));

app.use(cors());
app.use(bodyParser.json());

// ✅ Gửi mail
app.post('/api/send-email', (req, res) => {
  const { email, bmr, tdee } = req.body;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'Gialinhhoang2853@gmail.com',         // sửa lại email của bạn
      pass: 'deiqrdeopjvtoggw'     // dán mật khẩu app tại đây
    }
  });

  const mailOptions = {
    from: 'Gialinhhoang2853@gmail.com',
    to: email,
    subject: 'Dein TDEE & BMR Ergebnis',
    html: `<p>💡 Dein BMR ist: <b>${bmr} kcal</b><br>🔥 Dein TDEE ist: <b>${tdee} kcal</b></p>`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('❌ Fehler beim Senden:', error);
      res.json({ success: false });
    } else {
      console.log('✅ Email gesendet: ' + info.response);
      res.json({ success: true });
    }
  });
});

// ✅ Trả về HTML khi mở localhost:3000
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
  console.log(`🚀 Server läuft auf http://localhost:${port}`);
});
