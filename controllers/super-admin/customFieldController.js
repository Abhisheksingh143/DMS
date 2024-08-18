const {CustomField} = require('../../models/index');


const loadCustomFields = async function(req, res){
    
    const subDepartmentId = req.params.id;
    
    if(!subDepartmentId) return res.json('No subdeparment found');
    
    const customFields = await CustomField.findAll({
        where:{
        sub_department_id:subDepartmentId,
         }
    })
    return res.json(customFields)
}

const deleteCustomField = async function(req, res){

    const customFieldId = req.params.id;
    const customField = await CustomField.destroy({
        where:{
            id:customFieldId,
        }
    })
   
    return res.redirect('back')
}


module.exports = {

    loadCustomFields,
    deleteCustomField,
}