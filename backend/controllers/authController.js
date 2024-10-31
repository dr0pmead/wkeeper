const Users = require('../models/Users.cjs');



const authorization = async (req, res) => {
    console.log('accept')
    res.status(502).json({ message: 'Неверный логин или пароль' });
}
module.exports = {
    authorization
};