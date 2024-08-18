const {SubDepartment} = require('../../models/index');


const getSubDepartmentsForDepartments = async(req, res) => {

    const departmentId = req.params.id;
    console.log('hitted controller')
    const subDepartments = await SubDepartment.findAll({
        where:{department_id : departmentId}
    })
    return res.json(subDepartments);
}

module.exports = {getSubDepartmentsForDepartments}