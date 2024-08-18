const express = require('express');
const router = express.Router();
const authController = require('../../controllers/authController');
const { User, Branch, Department, SubDepartmentPermission } = require('../../models');




router.get('/login', async (req, res, next) => {
    try {
        // Check if user is logged in
       
        // If user is logged in, proceed to the next middleware or route handler
        next();
    } catch (error) {
        // Handle any errors that occur
        console.error('Error in /login route:', error);
        res.status(500).send('Internal Server Error');
    }
}, authController.getLoginPage);


router.post('/login',authController.postLogin);

module.exports = router;