const express = require('express');
const router = express.Router();

//require routes from their files
const departmentRoute = require('./department');
const subDepartmentRoute = require('./sub-department')
const documentRoutes = require('../document');
const userRoutes = require('../user')
const customFieldRoute = require('../super-admin/customFields');

router.use('/custom-field', customFieldRoute);
router.use('/users', userRoutes);
router.use('/departments', departmentRoute); // middleware applied
router.use('/sub-departments', subDepartmentRoute); 
router.use('/documents',documentRoutes)
router.use('/', (req, res) => {

    const user = req.session.user;

    res.render('admin/index',{user});
})
module.exports = router;