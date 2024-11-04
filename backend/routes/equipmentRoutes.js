const express = require('express')
const { addEquipment, getEquipments } = require('../controllers/equipmentController.js');

const router = express.Router();

// Маршрут для обработки запросов
router.post('/createEquipment', addEquipment);
router.get('/:division/:activeStatus', getEquipments);

module.exports = router;
