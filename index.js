const express = require('express');
const multer = require('multer');
const path = require('path');
const os = require('os');
const net = require('net');

const app = express();


// 设置文件保存的目录和文件名
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname); // 直接使用原始文件名
    }
});

// 创建 Multer 实例
const upload = multer({
    storage: storage
});

// 设置静态文件夹
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});
// 处理文件上传
app.post('/upload', upload.single('file'), (req, res) => {
  res.redirect('/');
});

// 获取文件列表
app.get('/files', (req, res) => {
    const fs = require('fs');
    fs.readdir('uploads', (err, files) => {
        if (err) {
            res.status(500).json({error: '无法读取文件列表'});
        } else {
            res.json(files);
        }
    });
});

let IP = '';
// 获取本机的网络接口信息
const interfaces = os.networkInterfaces();
// 遍历网络接口信息
Object.keys(interfaces).forEach(interfaceName => {
    const interfaceInfo = interfaces[interfaceName];
    // 遍历每个网络接口的IP地址
    interfaceInfo.forEach(info => {
        // 排除回环地址和IPv6地址
        if (info.family === 'IPv4' && !info.internal) {
            IP?null:IP = info.address
        }
    });
});

// 启动服务器
const server = app.listen(3000, () => {
    console.log('启动成功。。。。。。')
    console.log('本机访问:http://localhost:3000/');
    console.log(`同一局域网下：${IP}:3000`)
});


// 设置超时时间为10分钟
server.timeout = 600000000;

