const {Department, Branch, SubDepartment, User} = require('../models/index')

const checkDepartmentAccess = (req, res, next) => {
    const user = req.session.user; // Assuming you have user details in req.user
    const departmentId = req.params.id;

    // Assuming you have a method to find the department by id and include the branch details
    Department.findByPk(departmentId, { include: Branch })
        .then(department => {
            if (!department) {
                req.flash('error', 'Department not found');
                return res.redirect('back');
            }
            
            // Check if the department's branch_id matches the admin's branch_id
            if (user.role === 'admin' && department.branchId !== user.branch_id) {
                return res.redirect('back');
            }

            // If super-admin or the admin belongs to the same branch, allow access
            next();
        })
        .catch(err => {
            console.error(err);
            return res.status(500).json({ message: 'Server Error' });
        });
};


const checkSubDeptAccess = (req, res, next) => {
    const user = req.session.user; // Assuming you have user details in req.user
    const subDeptId = req.params.id;

    // Assuming you have a method to find the department by id and include the branch details
    SubDepartment.findByPk(subDeptId, {
        include: {
            model: Department,
            include: Branch
        }
    })
    .then(subDept => {
     
            if (!subDept) {
                req.flash('error', 'Sub Dept not found');
                return res.redirect('back');
            }
            
            // Check if the department's branch_id matches the admin's branch_id
            if (user.role === 'admin' && subDept.department.branch.id !== user.branch_id) {
                return res.redirect('/admin');
            }

            // If super-admin or the admin belongs to the same branch, allow access
            next();
        })
        .catch(err => {
            console.error(err);
            return res.status(500).json({ message: 'Server Error' });
        });
};

const checkUserAccess = (req, res, next) => {
    const user = req.session.user; // Assuming you have the logged-in user details in req.user
    const userId = req.params.id; // Assuming the user ID to be accessed is in the URL parameters
   
    User.findByPk(userId, { include: Branch })
        .then(targetUser => {
            if (!targetUser) {
                req.flash('error', 'User not found');
                return res.redirect(req.get('referer') || '/users'); // Fallback URL
            }

            // Check if the target user's branch_id matches the admin's branch_id
            if (user.role === 'admin' && targetUser.branch_id !== user.branch_id) {
                req.flash('error', 'Access Denied');
                return res.redirect('/admin/users'); // Fallback URL
            }

            // If super-admin or the admin belongs to the same branch, allow access
            next();
        })
        .catch(err => {
            console.error(err);
            req.flash('error', 'Server Error');
            return res.redirect(req.get('referer') || '/users'); // Fallback URL
        });
};


module.exports = {
    checkDepartmentAccess,
    checkSubDeptAccess,
    checkUserAccess,
};
