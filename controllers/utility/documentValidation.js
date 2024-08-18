const {CustomField} = require('../../models/index');

const {body} = require('express-validator')

const generateValidationRules = (fields) => {
    const rules = [];
  
    fields.forEach(field => {
      if (field.isRequired) {
        rules.push(body(field.fieldName).notEmpty().withMessage(`${field.fieldName} is required`));
      }
    });
    
    return rules;
  };
//8411030667

const  fetchCustomFields = async function(req, res, next){
    
    try{

    const {subDepartmentId} =  req.body;
    
    
    const customFields = await CustomField.findAll(
        {
            where:{sub_department_id:subDepartmentId},
           
        })
    
    const validationRules = generateValidationRules(customFields);

    await Promise.all(validationRules.map(rule => rule.run(req)));
    next();

    }catch(err){
        console.error(err)
    }

}



module.exports = {
    fetchCustomFields,
}