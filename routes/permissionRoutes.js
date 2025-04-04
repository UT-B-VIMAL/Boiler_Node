const express = require('express');
const router = express.Router();
const permissionController = require('../controllers/permissionController');
const authMiddleware = require('../middleware/authMiddleware');

// Secure routes
router.post('/', authMiddleware, permissionController.createPermission);
router.get('/', authMiddleware, permissionController.getAllPermissions);
router.get('/:id', authMiddleware, permissionController.getPermissionById);
router.put('/:id', authMiddleware, permissionController.updatePermission);
router.delete('/:id', authMiddleware, permissionController.deletePermission);

module.exports = router;
