const express = require('express')
const { addEquipment } = require('../controllers/equipmentController.js');

const router = express.Router();

// Маршрут для обработки запросов
router.post('/createEquipment', addEquipment);

module.exports = router;
