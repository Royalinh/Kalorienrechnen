const express = require('express'); //gọi thư viện express - framework Tạo web server
const path = require('path'); //gọi thư viện path để chạy trên mọi hệ điều hành được windows, macos, linux
const app = express(); //khởi tạo 1 uwsng dụng express
const port = 3000; //cổng mà server lắng nghe để mở trình duyệt

// Dùng thư mục hiện tại làm nơi phục vụ file tĩnh html , css, js, ảnh
app.use(express.static(__dirname));

// Trả về index.html khi truy cập /
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => { //khỏi động server và lắng nghe tại localhost:3000. Khi chạy thành công sẽ log ra dòng server läùt auf Terminal
  console.log(`🚀 Server läuft auf http://localhost:${port}`);
});