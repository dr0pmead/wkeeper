const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'editor', 'viewer'], default: 'viewer' },
    permissions: { type: [String], default: [] },
    lastLogin: { type: Date },
    loginHistory: [{
        time: { type: Date },
        success: { type: Boolean },
    }],
    twofaEnable: { type: Boolean },
    twofaSecret: { type: String, unique: true }
});

module.exports = mongoose.model('User', UserSchema);