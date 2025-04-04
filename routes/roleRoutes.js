const express = require('express');
const router = express.Router();
const roleController = require('../controllers/roleController');
const authMiddleware = require('../middleware/authMiddleware');

// Secure routes
router.post('/', authMiddleware, roleController.createRole);
router.get('/', authMiddleware, roleController.getAllRoles);
router.get('/:id', authMiddleware, roleController.getRoleById);
router.put('/:id', authMiddleware, roleController.updateRole);
router.delete('/:id', authMiddleware, roleController.deleteRole);

// Assign permissions to a role
router.post('/assign-permissions', authMiddleware, roleController.assignPermissions);

module.exports = router;
