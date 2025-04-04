const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    employeeId: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    role: { type: mongoose.Schema.Types.ObjectId, ref: 'Role', required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
    mfaSecret: { type: String, required: false }, // Added field for MFA secret
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
