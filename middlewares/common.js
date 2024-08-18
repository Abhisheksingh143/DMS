const { INTEGER } = require("sequelize");
const { Document, SubDepartmentPermission } = require("../models");

/**
 * 
 * 1- crreate
 * 2 - read/edit
 * 3- update
 * 4-delete
 */

const checkPermission = async(req, res, next, permissionId) =>{

    try{
    const user = req.session.user;
    let subDepartmentId = req.body.subDepartmentId

    if(user.role === 'super-admin' || user.role==='admin'){
       return next();
    }
   
    // const document = await Document.findByPk(docId);
   
    const userPermissions = await SubDepartmentPermission.findAll({
        where:{
            user_id:user.id,
            sub_department_id:subDepartmentId,
        }
    })
    if(!userPermissions) throw new Error('No permission assigned yet')
    const isAuthorized = userPermissions.some(permission => {
        return permission.permission_id === permissionId//edit permision
    });
    
    if(!isAuthorized) throw new Error('Not Permiable');
    else next()
    }
    catch(err){
        return res.status(500).send(err.message);
    }

}


const checkEditPermission = (req, res, next) => {
    return checkPermission(req, res, next, 2); // Assuming 2 is the permission ID for editing
};

const checkDeletePermission = (req, res, next) => {
    return checkPermission(req, res, next, 4); // Assuming 4 is the permission ID for deleting
};

const checkCreatePermission = (req, res, next) => {

    return checkPermission(req, res, next, 1);
}

module.exports = {
    checkEditPermission,
    checkDeletePermission,
    checkCreatePermission,
}