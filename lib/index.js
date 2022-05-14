const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const loggerMW = require('./middleware/logger');
const errorMW = require('./middleware/error');
const fatalErrorMW = require('./middleware/fatalError');

const indexRouter = require('./routes/index');
const booksRouter = require('./routes/books');
const booksApiRouter = require('./routes/api/books');
const usersRouter = require('./routes/user');

const app = express();

app.set("view engine", "ejs");

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

app.listen(3000);
