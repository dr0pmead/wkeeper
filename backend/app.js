const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const connectDB = require('./config/db.js');
const cors = require('cors');
const equipmentRoutes = require('./routes/equipmentRoutes.js');
const usersRoutes = require('./routes/usersRoutes.js')
const divisionRoutes = require('./routes/divisionRoutes.js')

dotenv.config();
connectDB();

const app = express();

app.use(cors());

// Настройка morgan для логирования запросов
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));  // Используем 'dev' стиль для логов в режиме разработки
}

app.use(express.json());
app.use('/equipment', equipmentRoutes);
app.use('/users', usersRoutes)
app.use('/division', divisionRoutes)

module.exports = app;
