const express = require('express')
const { authorization, verifyTwoFACode, getUserById } = require('../controllers/authController.js');

const router = express.Router();

// Маршрут для обработки запросов
router.post('/auth', authorization);
router.post('/verify-2fa', verifyTwoFACode)
router.get('/:userId', getUserById)

module.exports = router;
