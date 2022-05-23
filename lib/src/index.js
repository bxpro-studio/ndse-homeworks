const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const PORT = process.env.PORT || 3001;

const loggerMW = require(__dirname + '/middleware/logger');
const errorMW = require(__dirname + '/middleware/error');
const fatalErrorMW = require(__dirname + '/middleware/fatalError');

const indexRouter = require(__dirname + '/routes/index');
const booksRouter = require(__dirname + '/routes/books');
const booksApiRouter = require(__dirname + '/routes/api/books');
const usersRouter = require(__dirname + '/routes/user');

const app = express();

app.set("view engine", "ejs");
app.set('views', __dirname + '/views');

app.use(express.json());
app.use(bodyParser());

app.use(cors());
app.use(loggerMW);

app.use('/public', express.static(__dirname + '/public'));

app.use('/', indexRouter);
app.use('/books', booksRouter);
app.use('/api/books', booksApiRouter);
app.use('/user', usersRouter);

app.use(errorMW);

app.use(fatalErrorMW);

app.listen(PORT, () => {
    console.log(`Сервер слушает порт ${PORT}`);
});
