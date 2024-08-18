const { Department, User, Branch, SubDepartment } = require("../../models")

const showDepartments = async(req, res) => {

    //for admin show all departments of his branc

    const user = await User.findByPk(req.session.user.id);

    
    const departments = await Department.findAll({
        where:{
            branchId:user.branch_id,
        },
        include:[
            {
             model:Branch,            }
         ]
    })
    // return res.json(departments)

    return res.render('admin/department',
        {
            departments:departments,
        }
    );
}

const getCreateDepartment = async(req, res) => {

    const user =  await User.findByPk(req.session.user.id);
    // return res.json(Object.keys(User.prototype))
    // return res.json(await user.getDepartments());
    res.render('admin/department/create-department',
        {
            branches:[await user.getBranch()],
            mode:'create',
        }
    );
    
}

const editDepartment = async(req, res) => {

    const departmentId = req.params.id;
    const department = await Department.findByPk(departmentId)
    const user = await User.findByPk(req.session.user.id);
   
    res.render('admin/department/create-department',
        {   
            branches:[await user.getBranch()],
            department,
            mode:'edit'
        });

}

module.exports = 
{
    showDepartments,
    editDepartment,
    getCreateDepartment,
}