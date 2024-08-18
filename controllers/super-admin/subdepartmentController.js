const  { Department, SubDepartment, Branch, CustomField, User} =  require('../../models/index')


const saveCustomField = async function(customFields, subDepartmentId, edit=false){

    //validating if any label is empty
        for (const customField of customFields) {
            if (!customField.label || customField.label.trim() === '') {
                throw new Error('label cannot be empty')
            }
        }

            let customFieldData;
            const result = customFields.map(async(customField) => {
                const fieldName = 
                customField.label.toLowerCase().trim().split(/[ _]+/).join('_');

                if(customField.id){
                //old data so update i
                 customFieldData = await CustomField.findByPk(customField.id);
               
                customFieldData.label = customField.label;
                customFieldData.fieldName = fieldName;
                customFieldData.fieldType = customField.fieldType;
                customFieldData.isRequired = customField.isRequired;
                customFieldData.sub_department_id = subDepartmentId;
                
                await customFieldData.save();

                }else{
                //new data upload 
                
                 customFieldData =  {
                    ...customField,
                    fieldName,
                    sub_department_id: subDepartmentId
                };

                await CustomField.create(customFieldData);
                }
            return customFieldData;
            });
    
       return Promise.all(result);

}


const getSubDepartments = async(req,res)=>{

    const subDepartments = await SubDepartment.findAll({
        include:Department,
    });

    res.render('super/sub-department/index',{subDepartments})
}

const updateSubDepartment = async(req, res) => {
    
    const subDepartmentId = req.params.id;
    const user = req.session.user;

    const {sub_department_name, department_id, customFields}  = req.body;
    
    try {
        const subDepartment = await SubDepartment.findByPk(subDepartmentId);
        if(!subDepartment) throw new Error('No Sub department Found');

    //update subDepartment data
        subDepartment.sub_department_name = sub_department_name;
        subDepartment.department_id = department_id;
            
    //now update custom Fields
    if (customFields && customFields.length > 0) {
        
     await saveCustomField(customFields, subDepartmentId, true)
    
    }

    await subDepartment.save();
    if(user.role === 'admin') return res.redirect('/admin/sub-departments')
        else if(user.role === 'super-admin') res.redirect('/super/sub-departments');
        
    } catch (error) {
        res.status(500).send(error);
    }

}


const createSubDepartment = async(req,res)=>{

    const departments = await Department.findAll();
   
    const branches = await Branch.findAll();

    const edit = false;
    const customFields = []
    res.render('super/sub-department/create-subdepartment',{branches, departments, customFields, edit});
}


const postCreateSubDepartment = async (req, res) => {
    try {
        const user = req.session.user;
        const { sub_department_name, department_id, customFields } = req.body;

        let SubDepartmentExists = await SubDepartment.findOne({
            where:{sub_department_name : sub_department_name}
        });

        if(SubDepartmentExists) return res.json('Sub-Department Exists');

        // Create the SubDepartment
       const subDepartment = await SubDepartment.create({
            sub_department_name,
            department_id
        });

        if (!subDepartment) throw new Error('No subdepartment created');
        
        // Check and create custom fields if provided
        if(customFields)
         await saveCustomField(customFields, subDepartment.id)

        if(user.role === 'admin') return res.redirect('/admin/sub-departments')
            else if(user.role === 'super-admin') res.redirect('/super/sub-departments');
    } catch (error) {
        console.error('Error:', error);
        return res.status(400).json({ error: error.message });
    }
};


const edit = async(req, res) => {

    const edit = req.query.edit;

    try {

        const subDepartmentId = req.params.id;
        
        const subDepartment = await SubDepartment.findByPk(subDepartmentId, {
            include: {
                model: Department,
                include: Branch
            }
        });

        // return res.json(subDepartment);
        if(!subDepartment) throw new Error('No Sub department Found');

        const branches = await Branch.findAll();

        const departments = await Department.findAll({
            where:{
                branchId : subDepartment.department.branch.id,
            }
        });

        const customFields = await CustomField.findAll({
            where:{
                sub_department_id:subDepartmentId,
            }
        });

        
        // return res.json(departments);
                return res.render('super/sub-department/create-subdepartment',{
                    subDepartment, branches, edit, departments, customFields
                })

    } catch (error) {
        res.send(error);
    }

}


const deleteSubDepartment = async(req, res) => {

    
    try {
        const subDepartmentId = req.params.id;
        
        const result = await SubDepartment.destroy({
            where:{
                id:subDepartmentId,
            }
        })

        if (!result) {
            return res.status(404).json({ message: 'No sub-department found with that ID.' });
        }

        res.status(200).redirect('/super/sub-departments');


    } catch (error) {
        res
        .status(500)
        .json({ message: 'An error occurred while trying to delete the sub-department.' });
    }

}



module.exports = {
    getSubDepartments,
    createSubDepartment,
    postCreateSubDepartment,
    updateSubDepartment,
    edit,
    deleteSubDepartment,
    
};