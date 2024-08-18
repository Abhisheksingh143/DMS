const db = require("../../models/index");
const {User, SubDepartment, Permission, SubDepartmentPermission,Department, Branch} = db;


const showRights = async(req, res) => {

    try {

      const userId = req.params.id;
        
      if (!userId) {
        return res.status(400).json({ error: 'ID parameter is required' });
      }
      

      //find user data
      const userPermissions = await User.findByPk(userId, {
        include: [
          {
            model: SubDepartmentPermission,
            attributes:['id','department_id','sub_department_id','permission_id'],
            include: [
                {
                    model:SubDepartment,
                    attributes:['sub_department_name'],
                },
                {
                    model:Permission, 
                    attributes:['permission_name'],
                },
                {
                    model:Department,
                    attributes:['department_name'],
                    include: [
                        {
                          model: Branch, // Branch associated with SubDepartment
                          attributes: ['id', 'branch_name'] // Attributes for Branch model
                        }
                      ]
                },
            ]
          }
        ]
      });
    //   return res.json(user);
      const permissions =  await Permission.findAll();
      
      if(!userPermissions) throw new Error('No user found with such ID');
    
      const branch = await userPermissions.getBranch();
      if(!branch) throw new Error('No branch Found');
      
      let departments = await branch.getDepartments();
      if(!departments) departments = [];
  
      const subDepartments = await SubDepartment.findAll();

      return res.render('users/user-rights', 
        {userPermissions, branch, departments, subDepartments, permissions});
      
    } catch (error) {
      console.error(error)
        return res.status(500).send(error.message);
    }
  
  }

const createPermissions = async(req, res) => {
  
    try {
      
      const {
            userId, 
            departmentId, 
            subDepartmentId, 
          } = req.body; 

        let [...permissions] = req.body.permissions;
          
      const user = await User.findByPk(userId);
      if(!user) throw new Error('No user Found');
  
      if(!permissions) {
          throw new Error('Permission Not Selected. Select At least one permission');
      }
  
      const promises =  permissions.map(async(permissionId) => {
  
        return await user.createSubDepartment_permission(
             {
               sub_department_id:subDepartmentId,
               permission_id: permissionId,
               department_id:departmentId,
             }
           )
         });
         
      const result = await Promise.all(promises);
      
      if(!result) throw new Error('Something went wrong while giving rights')
        return res.status(200).redirect('back')
    } catch (error) {
      return res.status(500).json({ error: 'Failed to create permissions', message:error.message });
    }
  
  }
  
  const deleteRight = async(req, res) => {
    
    try {

      const permissionId  = req.params.p_id;
      if(!permissionId) throw new Error('NO permission Id Found')

      const permission = await SubDepartmentPermission.destroy({
          where:{
              id:permissionId,
          }
      })
      
      if(!permission) throw new Error('Permission Falied')

       if(req.session.user.role === 'amdin') 
        return res.redirect('/admin/users')
       else 
        return res.redirect('/super/users')

    } catch (error) {
      console.error(error)

    }


  }


  module.exports = {
    createPermissions,
    showRights,
    deleteRight,
  }