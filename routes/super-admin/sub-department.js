const express = require('express');
const router = express.Router();
const subDepartmentController = require('../../controllers/super-admin/subdepartmentController')
const utilityController = require('../../controllers/utility/functions')

router.get('/', subDepartmentController.getSubDepartments)
router.get('/create', subDepartmentController.createSubDepartment)
router.get('/:id', subDepartmentController.edit);

//common route
router.get('/getsubdepartment/:id', utilityController.getSubDepartmentsForDepartments)

//post route
router.post('/create', subDepartmentController.postCreateSubDepartment)
router.post('/update/:id', subDepartmentController.updateSubDepartment)
router.post('/:id/delete', subDepartmentController.deleteSubDepartment);


module.exports = router;