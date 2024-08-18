
const {Department, Branch, User} = require('../../models/index')

const getDepartments = async(req,res) => {

    const departments = await Department.findAll({
        include:Branch,
    });

    res.render('super/department/index',{departments});
}


const createDepartment = async(req,res) => {
    
    const user = await User.findByPk(1);
    const mode = 'create';
    const branches = await Branch.findAll();
    
    res.render('admin/department/create-department',{branches, mode})
}


const editDepartment = async(req, res) =>{

    const departmentId = req.params.id;
    const mode = 'edit';

    const branches = await Branch.findAll();

    const department = await Department.findByPk(departmentId);

    res.render('admin/department/create-department', {department, branches, mode})

}

const postCreateDepartment = async(req, res)=>{
    
   const user = req.session.user;
    const { branch_name: branchId, department_name } = req.body;

    try {
         await Department.create({
            branchId,
            department_name,
        });
    
    } catch (error) {
        res.status(500).send(error)
    }

    if(user.role === 'admin') return res.redirect('/admin/departments')
    else if(user.role === 'super-admin') res.redirect('/super/departments');
}

const updateDepartment = async(req, res) => {

    const user = req.session.user;
    
    const departmentId = req.params.id;

    const { branch_name: branchId, department_name } = req.body;

    try {
        const department = await Department.findByPk(departmentId);
        if(!department) throw new Error('No Department Found');

        department.branchId = branchId;
        department.department_name = department_name;
        
        await department.save();

       if(user.role === 'admin') return res.redirect('/admin/departments')
        else if(user.role === 'super-admin') res.redirect('/super/departments');
        
    } catch (error) {
        res.status(500).send(error);
    }

}


const findDepartment =  async(req, res) =>{

    const { branchId } = req.query;

    console.log('method ')
    try {
        const departments = await Department.findAll({
            where: { branchId: branchId }
        });
        res.json(departments);
    } catch (error) {
        console.error('Error fetching departments:', error);
        res.status(500).send('Internal Server Error');
    }

}


const deleteDepartment = async(req, res) => {

    try {

        const user = req.session.user;
        const departmentId = req.params.id;
      
        const result = await Department.destroy({
            where:{
                id:departmentId,
            }
        })
      
        if (!result) {
            return res.status(404).json({ message: 'No Department found with that ID.' });
        }

        
        if(user.role === 'admin') return res.redirect('/admin/departments')
        else if(user.role === 'super-admin') res.redirect('/super/departments');



    } catch (error) {
        console.log(error)
        res
        .status(500)
        .json({ message: 'An error occurred while trying to delete the department.' });
    }

}

module.exports = {
    getDepartments,
    createDepartment,
    editDepartment,
    postCreateDepartment,
    updateDepartment,
    findDepartment,
    deleteDepartment,
}