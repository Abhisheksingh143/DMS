const { SubDepartment, Department, User, Branch, CustomField } = require("../../models");

const getSubDepartments = async(req, res)=>{

    //load all sub-departments present in branch
    const user = req.session.user;

    const subDepartments = await SubDepartment.findAll({
        include: [
            {
                model: Department,
                where: { branchId: user.branch_id }, // Filter by branch ID
            }
        ]
    });   

    res.render('admin/sub-department',{
        subDepartments,
    })


}


const editSubDepartment = async(req, res) =>{

    const edit = req.query.edit;    
   const user = req.session.user;
    

    try{

    //we need to find sub-department of that id;
        const subDepartmentId = req.params.id;
        const subDepartment = await SubDepartment.findByPk(subDepartmentId, {
            include: {
                model: Department,
                include: Branch
            }
        });
    
        if(!subDepartment) throw new Error('No Sub department Found');

        const branches = await Branch.findAll({
            where:{
                id:user.branch_id
            }
        });

        const departments = await Department.findAll({
            where:{
                branchId : branches[0].id,
            }
        });

       
        const customFields = await CustomField.findAll({
            where:{
                sub_department_id:subDepartmentId,
            }
        });

        return res.render('admin/sub-department/create-subdepartment',{
            subDepartment, branches, edit, departments, customFields
        })

    }catch(err){
        console.log(err);
    }

}

const getCreateDepartment = async(req, res) => {

    //pass only login admin branch
    try{
        
    const userId = req.session.user.id;
    const user = await User.findByPk(userId);
    
    if(!user) throw new Error('No user found');

    const branches = await user.getBranch();
    const departments = await branches.getDepartments();

    const edit = false;
    const customFields = []

    res.render('admin/sub-department/create-subdepartment',
        {
        branches:[branches], 
        departments, customFields, edit});

    }catch(err){
        console.log(err);
    }

}



module.exports = {

    getSubDepartments,
    editSubDepartment,
    getCreateDepartment,
}