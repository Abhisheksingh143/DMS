const express = require('express');
const router = express.Router();
const userRoutes = require('../user')
const branchRoute = require('./branch')
const departmentRoute = require('./department')
const subDepartmentRoute = require('./sub-department')
const documentRoute = require('../document')
const customFieldRoute = require('./customFields');

router.use('/custom-field', customFieldRoute);
router.use('/sub-departments',subDepartmentRoute);
router.use('/branches',branchRoute);
router.use('/departments',departmentRoute);
router.use('/documents',documentRoute);
router.use('/users',userRoutes);


module.exports = router;