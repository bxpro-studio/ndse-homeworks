const express = require('express');
//const bodyParser = require('body-parser');
const cors = require('cors');

const loggerMW = require('./middleware/logger');
const errorMW = require('./middleware/error');
const fatalErrorMW = require('./middleware/fatalError');

const indexRouter = require('./routes/index');
const booksRouter = require('./routes/books');
const usersRouter = require('./routes/user');

const app = express();

//app.use(bodyParser());
app.use(cors());
app.use(loggerMW);

app.use('/public', express.static(__dirname + '/public'));

app.use('/', indexRouter);
app.use('/api/books', booksRouter);
app.use('/api/user', usersRouter);

app.use(errorMW);

app.use(fatalErrorMW);

app.listen(3000);
