const express = require('express')
const router = express.Router();

const departmentRoute = require('../admin/department');
const subDepartmentRoute = require('../admin/sub-department')
const documentRoutes = require('../document');
const userRoutes = require('../user')
const customFieldRoute = require('../../routes/super-admin/customFields');
const {test, getsd} = require('../../controllers/documentController')


router.use('/custom-field', customFieldRoute);
// router.use('/users', userRoutes);
// router.use('/departments', departmentRoute); // middleware applied
// router.use('/sub-departments', subDepartmentRoute); 
router.use('/documents',documentRoutes)
router.get('/docs/',test)
router.get('/sd',getsd);
router.use('/', (req, res) => {

    const user = req.session.user;
    
    res.render('staff/index',{user});
})
module.exports = router;