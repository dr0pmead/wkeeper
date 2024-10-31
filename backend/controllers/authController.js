const Users = require('../models/Users.cjs');


async function authorization(req, res) {
    console.log('accept')
    res.status(502).json({});
}

module.exports = {
    authorization
};