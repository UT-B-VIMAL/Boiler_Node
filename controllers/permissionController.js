const Permission = require('../models/permission');
const { successResponse, errorResponse } = require('../utils/responseHandler');

// Create a new permission
exports.createPermission = async (req, res) => {
    try {
        const { name, description } = req.body;
        const permission = new Permission({ name, description });
        await permission.save();
        successResponse(res, permission, 'Permission created successfully', 'success');
    } catch (error) {
        errorResponse(res, 'Error creating permission', error);
    }
};

// Get all permissions
exports.getAllPermissions = async (req, res) => {
    try {
        const permissions = await Permission.find();
        successResponse(res, permissions, 'Permissions fetched successfully', 'success');
    } catch (error) {
        errorResponse(res, 'Error fetching permissions', error);
    }
};

// Get a permission by ID
exports.getPermissionById = async (req, res) => {
    try {
        const permission = await Permission.findById(req.params.id);
        if (!permission) {
            return errorResponse(res, 'Permission not found', null, 404);
        }
        successResponse(res, permission, 'Permission fetched successfully', 'success');
    } catch (error) {
        errorResponse(res, 'Error fetching permission', error);
    }
};

// Update a permission by ID
exports.updatePermission = async (req, res) => {
    try {
        const { name, description } = req.body;
        const permission = await Permission.findByIdAndUpdate(
            req.params.id,
            { name, description },
            { new: true }
        );
        if (!permission) {
            return errorResponse(res, 'Permission not found', null, 404);
        }
        successResponse(res, permission, 'Permission updated successfully', 'success');
    } catch (error) {
        errorResponse(res, 'Error updating permission', error);
    }
};

// Delete a permission by ID
exports.deletePermission = async (req, res) => {
    try {
        const permission = await Permission.findByIdAndDelete(req.params.id);
        if (!permission) {
            return errorResponse(res, 'Permission not found', null, 404);
        }
        successResponse(res, null, 'Permission deleted successfully', 'success');
    } catch (error) {
        errorResponse(res, 'Error deleting permission', error);
    }
};
