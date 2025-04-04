const mongoose = require('mongoose');

const permissionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
        required: false,
    },
}, { timestamps: true });

module.exports = mongoose.model('Permission', permissionSchema);
