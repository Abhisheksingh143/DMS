const branchController = require('../../controllers/super-admin/branchController')
const express = require('express')
const router = express.Router();

//get routes

router.get('/',branchController.getBranches)
router.get('/create',branchController.createBranch)
router.get('/:id/edit',branchController.editBranch)


//ppost routes
router.post('/create',branchController.postCreateBranch)
router.post('/:id/update',branchController.updateBranch)
router.post('/:id/delete', branchController.deleteDepartment);



module.exports = router;