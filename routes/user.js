const express = require('express');
const router = express.Router();
const userController = require('../controllers/super-admin/userController');
const permissionController = require('../controllers/super-admin/permissionController')
const {checkUserAccess} = require('../middlewares/admin')
//get routes
router.get('/create',  userController.createUser);
router.get('/',userController.getUsers)
router.get('/edit/:id/', checkUserAccess,  userController.editUser)

//post routes
router.post('/create', userController.postCreateUser);
router.post('/:id/update', checkUserAccess, userController.postCreateUser);
router.post('/:id/delete', userController.deleteUser);

//permissions routes
router.get('/:id/user-rights', checkUserAccess, permissionController.showRights);
router.post('/create-permission', permissionController.createPermissions);
router.post('/:id/delete-right/:p_id',checkUserAccess, permissionController.deleteRight);
module.exports = router;

