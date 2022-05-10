const express = require('express');
const router = express.Router();
const { Users } = require('../models');

router.get('/err', (req, res) => {
    throw new Error('Возникла ошибка!');
});

router.get('/', (req, res) => {
    throw new Error('Пользователей пока нет');
});

router.post('/login', (req, res) => {
    throw new Error('Пользователей пока нет');
});

module.exports = router;
