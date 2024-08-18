const express = require('express');
const router = express.Router();
const subdepartmentController = require('../../controllers/admin/sub-departmentController')
const utilityController = require('../../controllers/utility/functions')
const superSubDepartmentController = require('../../controllers/super-admin/subdepartmentController')
const {checkSubDeptAccess} = require('../../middlewares/admin')

//GET ROUTES
router.get('/',subdepartmentController.getSubDepartments);
router.get('/create', subdepartmentController.getCreateDepartment)

//post route
router.post('/create', superSubDepartmentController.postCreateSubDepartment)
router.post('/update/:id', checkSubDeptAccess, superSubDepartmentController.updateSubDepartment)
router.post('/:id/delete', checkSubDeptAccess, superSubDepartmentController.deleteSubDepartment);

//common route
router.get('/getsubdepartment/:id', utilityController.getSubDepartmentsForDepartments)
router.get('/:id', checkSubDeptAccess, subdepartmentController.editSubDepartment)


module.exports = router;