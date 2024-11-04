const express = require('express');
const router = express.Router();
const { getAllDivisions } = require('../controllers/divisionController');

router.get('/getAll', getAllDivisions);

module.exports = router;
