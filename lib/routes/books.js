const express = require('express');
const router = express.Router();
const { Books } = require('../models');
const fileMiddleware = require('../middleware/file');
const coverMiddleware = require('../middleware/cover');

const db = {
    books: [],
};

[1, 2, 3].map(el => {
    const newLib = new Books(`title book ${el}`, `description book ${el}`, `authors book ${el}`, false, '', '', '', `id${el}`);
    db.books.push(newLib);
});

router.get('/err', (req, res) => {
    throw new Error('Возникла ошибка!');
});

router.get('/', (req, res) => {
    const { books } = db;
    res.json(books);
});

router.get('/:id', (req, res) => {
    const { books } = db;
    const { id } = req.params;
    const idx = books.findIndex(el => el.id === id);

    if (idx !== -1) {
        res.json(books[idx]);
    } else {
        res.status(404);
        res.json("books | not found");
    }
});

router.post('/', (req, res) => {
    const { books } = db;
    const { title, description, authors, favorite } = req.body;

    const newLib = new Books(title, description, authors, favorite);
    books.push(newLib);

    res.status(201);
    res.json(newLib);
});

router.put('/:id', (req, res) => {
    const { books } = db;
    const { title, description, authors, favorite } = req.body;
    const { id } = req.params;
    const idx = books.findIndex(el => el.id === id);

    if (idx !== -1) {
        books[idx] = {
            ...books[idx],
            title,
            description,
            authors,
            favorite
        };
        res.json(books[idx]);
    } else {
        res.status(404);
        res.json("books | not found");
    }
});

router.delete('/:id', (req, res) => {
    const { books } = db;
    const { id } = req.params;
    const idx = books.findIndex(el => el.id === id);

    if (idx !== -1) {
        books.splice(idx, 1);
        res.json(true);
    } else {
        res.status(404);
        res.json("books | not found");
    }
});

////// файл книги
router.post('/:id/upload-file', fileMiddleware.single('book-file'), (req, res) => {
    const { books } = db;
    const { id } = req.params;
    const idx = books.findIndex(el => el.id === id);

    if (idx !== -1) {
        if (req.file) {
            const fileName = req.file.originalname;
            const fileBook = req.file.path;

            books[idx] = {
                ...books[idx],
                fileName,
                fileBook
            };

            res.status(201);
            res.json(books[idx]);
        } else {
            res.json(null);
        }
    } else {
        res.status(404);
        res.json(`books | book with ID:${id} not found`);
    }
});

router.get('/:id/download-file', (req, res) => {
    const { books } = db;
    const { id } = req.params;
    const idx = books.findIndex(el => el.id === id);
    const fileName = books[idx].fileName;
    const fileBook = books[idx].fileBook;

    res.download(fileBook, fileName, err => {
        if (err) {
            res.status(404).json();
        }
    });
});

router.delete('/:id/delete-file', (req, res) => {
    const { books } = db;
    const { id } = req.params;
    const idx = books.findIndex(el => el.id === id);

    if (idx !== -1) {
        if (books[idx].fileBook) {
            const fs = require('fs');
            
            fs.unlink(books[idx].fileBook, (err) => {
                console.log(err);
            });
        }

        books[idx].fileName = '';
        books[idx].fileBook = '';
        
        res.json(true);
    } else {
        res.status(404);
        res.json(`books | book with ID:${id} not found`);
    }
});

////// файл обложки
router.post('/:id/upload-cover', coverMiddleware.single('cover-img'), (req, res) => {
    const { books } = db;
    const { id } = req.params;
    const idx = books.findIndex(el => el.id === id);

    if (idx !== -1) {
        if (req.file) {
            const fileCover = req.file.path;

            books[idx] = {
                ...books[idx],
                fileCover
            };

            res.status(201);
            res.json(books[idx]);
        } else {
            res.json(null);
        }
    } else {
        res.status(404);
        res.json(`books | book with ID:${id} not found`);
    }
});

router.get('/:id/download-cover', (req, res) => {
    const { books } = db;
    const { id } = req.params;
    const idx = books.findIndex(el => el.id === id);
    const fileCover = books[idx].fileCover;

    res.download(fileCover, 'cover.png', err => {
        if (err) {
            res.status(404).json();
        }
    });
});

router.delete('/:id/delete-cover', (req, res) => {
    const { books } = db;
    const { id } = req.params;
    const idx = books.findIndex(el => el.id === id);

    if (idx !== -1) {
        if (books[idx].fileCover) {
            const fs = require('fs');

            fs.unlink(books[idx].fileCover, (err) => {
                console.log(err);
            });
        }

        books[idx].fileCover = '';

        res.json(true);
    } else {
        res.status(404);
        res.json(`books | book with ID:${id} not found`);
    }
});

module.exports = router;
