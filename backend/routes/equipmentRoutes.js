const express = require('express')
const { addEquipment, getEquipments, getEquipment, editEquipment } = require('../controllers/equipmentController.js');

const router = express.Router();

// Маршрут для обработки запросов
router.post('/createEquipment', addEquipment);
router.get('/:division/:activeStatus', getEquipments);
router.get('/:id', getEquipment)
router.put('/:id/edit', editEquipment)

module.exports = router;
