const mongoose = require('mongoose');

const sampleSchema = new mongoose.Schema({
    name: String,
}, { timestamps: true });

module.exports = mongoose.model("Sample", sampleSchema);
