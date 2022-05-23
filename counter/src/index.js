const express = require('express');
const cors = require('cors');
const redis = require('redis');

const PORT = process.env.PORT || 3002;

const counterApiRouter = require(__dirname + '/routes/api/counter');

const app = express();
app.use(express.json());

app.use(cors());

app.use('/counter', counterApiRouter);

app.listen(PORT, () => {
    console.log(`Сервер слушает порт ${PORT}`);
});