const express = require('express')
const { authorization } = require('../controllers/authController.js');

const router = express.Router();

// Маршрут для обработки запросов
router.post('/auth', authorization);

module.exports = router;
