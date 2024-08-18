const departmentController = require('../../controllers/super-admin/departmentController')
const express = require('express')
const router = express.Router();

router.get('/',departmentController.getDepartments)
router.get('/create',departmentController.createDepartment)
router.get('/:id/edit',departmentController.editDepartment)

//used to get departments on branch id
router.get('/get',departmentController.findDepartment)


//post routes
router.post('/create', departmentController.postCreateDepartment)
router.post('/:id/update',departmentController.updateDepartment);
router.post('/:id/delete', departmentController.deleteDepartment);


module.exports = router;