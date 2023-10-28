const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const app = express();

// Путь к папке с изображениями
const uploadDir = path.join(__dirname, 'public/images');

// Настройка хранилища Multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage });

app.use(express.static('public'));

app.get('/', (req, res) => {
    // Получение списка файлов в папке
    const imageFiles = fs.readdirSync(uploadDir).filter((file) => {
        // Фильтруем только файлы с поддерживаемыми расширениями
        const extname = path.extname(file).toLowerCase();
        return extname === '.jpg' || extname === '.jpeg' || extname === '.png' || extname === '.gif';
    });

    res.json(imageFiles);
    console.log('\x1b[37m', 'Folder content listed successfully: \n', imageFiles);
});

app.post('/upload', upload.single('file'), (req, res) => {
    if (req.file) {
        console.log('\x1b[37m', 'Successful upload:', req.file.originalname); // Успешная загрузка, белый текст
        res.send('File uploaded successfully');
    } else {
        console.log('\x1b[31m', 'Error uploading file'); // Ошибка при загрузке, красный текст
        res.status(500).send('Error uploading file');
    }
});

app.get('/image/:filename', (req, res) => {
    const { filename } = req.params;
    const imagePath = path.join(uploadDir, filename);

    if (fs.existsSync(imagePath)) {
        console.log('\x1b[37m', 'Image found successfully:', filename);
        res.sendFile(imagePath);
    } else {
        console.log('\x1b[31m', 'Image not found:', filename); // Картинка не найдена, выводится в красном цвете
        res.status(404).send('Image not found');
    }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
