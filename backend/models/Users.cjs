const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'editor', 'viewer'], default: 'viewer' },
    permissions: { type: [String], default: [] },
    status: { type: String, enum: ['active', 'inactive', 'banned'], default: 'active' },
    lastLogin: { type: Date },
    loginHistory: [{
    time: { type: Date },
    success: { type: Boolean },
    }],
});

module.exports = mongoose.model('User', UserSchema);