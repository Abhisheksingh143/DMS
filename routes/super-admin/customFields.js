const express = require('express');
const router = express.Router();
const customFieldController = require('../../controllers/super-admin/customFieldController')


//get routes
router.get('/fetch/:id/all', customFieldController.loadCustomFields);


//post routes
router.post('/:id/delete', customFieldController.deleteCustomField);


module.exports = router;

/**
 * admin and super-admin have same access 
 * 
 * Middleware -> check roles and if(role==admin|superAdmin) -> next()
 * 
 * what we need to do
 *  1. admin must access only his branch
 *  2. admin must access only his departments
 *  3. admin must access his sub-departments
 *  
 *  Documents -> 
 *  1. show all documents and dont check permissions
 * 
 * 
 * 
 * SuperAdmin-> Branches, Departments, Sub-Departments, Documents
 


 * User -> Documents
    1. load only docs 


 */