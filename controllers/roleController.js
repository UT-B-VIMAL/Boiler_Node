const Role = require('../models/role');
const { successResponse, errorResponse } = require('../utils/responseHandler');

// Create a new role
exports.createRole = async (req, res) => {
    try {
        const { name, description } = req.body;
        const role = new Role({ name, description });
        await role.save();
        successResponse(res, role, 'Role created successfully', 'success');
    } catch (error) {
        errorResponse(res, 'Error creating role', error);
    }
};

// Get all roles
exports.getAllRoles = async (req, res) => {
    try {
        const roles = await Role.find();
        successResponse(res, roles, 'Roles fetched successfully', 'success');
    } catch (error) {
        errorResponse(res, 'Error fetching roles', error);
    }
};

// Get a role by ID
exports.getRoleById = async (req, res) => {
    try {
        const role = await Role.findById(req.params.id);
        if (!role) {
            return errorResponse(res, 'Role not found', null, 404);
        }
        successResponse(res, role, 'Role fetched successfully', 'success');
    } catch (error) {
        errorResponse(res, 'Error fetching role', error);
    }
};

// Update a role by ID
exports.updateRole = async (req, res) => {
    try {
        const { name, description } = req.body;
        const role = await Role.findByIdAndUpdate(
            req.params.id,
            { name, description },
            { new: true }
        );
        if (!role) {
            return errorResponse(res, 'Role not found', null, 404);
        }
        successResponse(res, role, 'Role updated successfully', 'success');
    } catch (error) {
        errorResponse(res, 'Error updating role', error);
    }
};

// Delete a role by ID
exports.deleteRole = async (req, res) => {
    try {
        const role = await Role.findByIdAndDelete(req.params.id);
        if (!role) {
            return errorResponse(res, 'Role not found', null, 404);
        }
        successResponse(res, null, 'Role deleted successfully', 'success');
    } catch (error) {
        errorResponse(res, 'Error deleting role', error);
    }
};

// Assign multiple permissions to a role
exports.assignPermissions = async (req, res) => {
    try {
        const { roleId, permissionIds } = req.body;

        // Validate role
        const role = await Role.findById(roleId);
        if (!role) {
            return errorResponse(res, 'Role not found', null, 404);
        }

        // Validate permissions
        const permissions = await Permission.find({ _id: { $in: permissionIds } });
        if (permissions.length !== permissionIds.length) {
            return errorResponse(res, 'Some permissions not found', null, 404);
        }

        // Add new permissions to the existing ones (avoid duplicates)
        const updatedPermissions = [...new Set([...role.permissions, ...permissionIds])];
        role.permissions = updatedPermissions;
        await role.save();

        successResponse(res, role, 'Permissions added to role successfully', 'success');
    } catch (error) {
        errorResponse(res, 'Error adding permissions to role', error);
    }
};
