#!/usr/bin/env node

const express = require('express');

const {Lib} = require('./models');
const db = {
    books: [],
};

[1, 2, 3].map(el => {
    const newLib = new Lib(`title book ${el}`, `description book ${el}`, `authors book ${el}`, `favorite book ${el}`, `fileCover book ${el}`, `fileName book ${el}`);
    db.books.push(newLib);
});

const app = express();

app.use(express.json());

app.get('/api/books', (req, res) => {
    const {books} = db;
    res.json(books);
});

app.get('/api/books/:id', (req, res) => {
    const {books} = db;
    const {id} = req.params;
    const idx = books.findIndex(el => el.id === id);

    if (idx !== -1) {
        res.json(books[idx]);
    } else {
        res.status(404);
        res.json("books | not found");
    }
});

app.post('/api/books', (req, res) => {
    const {books} = db;
    const {title, description, authors, favorite, fileCover, fileName} = req.body;

    const newLib = new Lib(title, description, authors, favorite, fileCover, fileName);
    books.push(newLib);

    res.status(201);
    res.json(newLib);
});

app.post('/api/user/login', (req, res) => {
    res.status(201);
    res.json({ id: 1, mail: "test@mail.ru" });
});

app.put('/api/books/:id', (req, res) => {
    console.log(req.body)
    const {books} = db;
    const {title, description, authors, favorite, fileCover, fileName} = req.body;
    const {id} = req.params;
    const idx = books.findIndex(el => el.id === id);

    if (idx !== -1) {
        books[idx] = {
            ...books[idx],
            title,
            description,
            authors,
            favorite,
            fileCover,
            fileName
        };
        res.json(books[idx]);
    } else {
        res.status(404);
        res.json("books | not found");
    }
});

app.delete('/api/books/:id', (req, res) => {
    const {books} = db;
    const {id} = req.params;
    const idx = books.findIndex(el => el.id === id);

    if (idx !== -1) {
        books.splice(idx, 1);
        res.json(true);
    } else {
        res.status(404);
        res.json("books | not found");
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
