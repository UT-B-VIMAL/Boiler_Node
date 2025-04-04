const Sample = require('../models/sampleModel');
const { successResponse, errorResponse } = require("../utils/responseHandler");


// Get all Samples
exports.getSample = async (req, res) => {
    try {
        const Samples = await Sample.find();
        return successResponse(res, Samples, "Sample data fetched successfully", 200);
    } catch (error) {
        return errorResponse(res, error.message);
    }
};

// Create a new Sample
exports.createSample = async (req, res) => {
    try {
        const { name } = req.body;
        const newSample = new Sample({ name });
        await newSample.save();
        return successResponse(res, newSample, "Sample created successfully", 200);
    } catch (error) {
        return errorResponse(res, error.message);
    }
};
