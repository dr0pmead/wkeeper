const mongoose = require('mongoose')

const DivisionSchema = new mongoose.Schema({
    name: { type: String, unique: true },
    rusName: { type: String, unique: true }
});

module.exports = mongoose.model('Division', DivisionSchema);