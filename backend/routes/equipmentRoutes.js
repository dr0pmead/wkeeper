const express = require('express')
const { addEquipment, getEquipments, getEquipment } = require('../controllers/equipmentController.js');

const router = express.Router();

// Маршрут для обработки запросов
router.post('/createEquipment', addEquipment);
router.get('/:division/:activeStatus', getEquipments);
router.get('/:id', getEquipment)

module.exports = router;
