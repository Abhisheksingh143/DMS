const express = require('express');
const router = express.Router();
const departmentController = require('../../controllers/admin/departmentController')
const superDepartmentController = require('../../controllers/super-admin/departmentController')

//middleware
const {checkDepartmentAccess} = require('../../middlewares/admin');

//GET ROUTES
router.get('/',departmentController.showDepartments)
router.get('/:id/edit', checkDepartmentAccess, departmentController.editDepartment)
router.get('/create-department', departmentController.getCreateDepartment)

//post routes
router.post('/create', superDepartmentController.postCreateDepartment)
router.post('/:id/update', checkDepartmentAccess, superDepartmentController.updateDepartment);
router.post('/:id/delete', checkDepartmentAccess, superDepartmentController.deleteDepartment);

//used to get departments on branch id
router.get('/get',superDepartmentController.findDepartment)
module.exports = router;