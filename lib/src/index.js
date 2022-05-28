const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

const PORT = process.env.PORT || 3000;
const UserDB = process.env.DB_USERNAME || 'root';
const PasswordDB = process.env.DB_PASSWORD || 'qwerty12345';
const NameDB = process.env.DB_NAME || 'books'
const HostDb = process.env.DB_HOST || 'mongodb://localhost:27017/'

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

//app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(cors());
app.use(loggerMW);

app.use('/public', express.static(__dirname + '/public'));

app.use('/', indexRouter);
app.use('/books', booksRouter);
app.use('/api/books', booksApiRouter);
app.use('/user', usersRouter);

app.use(errorMW);

app.use(fatalErrorMW);

async function start() {
    try {
        //const UrlDB = `mongodb+srv://${UserDB}:${PasswordDB}@cluster0.grfrs.mongodb.net/${NameDB}`;
        //const UrlDB = `mongodb://localhost:27017/mydb`;
        //const UrlDB = `mongodb://${UserDB}:${PasswordDB}@localhost:27017/mydb`;
        //await mongoose.connect(UrlDb);
        
        await mongoose.connect(HostDb, {
            user: UserDB,
            pass: PasswordDB,
            dbName: NameDB,
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        app.listen(PORT, () => {
            console.log(`Сервер слушает порт ${PORT}`);
        })
    } catch (e) {
        console.log(e);
    }
}

start();