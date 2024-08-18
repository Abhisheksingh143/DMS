
module.exports = function(sequelize, DataTypes){

    const CustomFields = sequelize.define('customFields',{
        id:{
            type:DataTypes.INTEGER,
            primaryKey :true,
            autoIncrement:true,
        },
        sub_department_id:{
            type:DataTypes.INTEGER,
            allowNull:false,
            references:{
                model:'sub_departments',
                key:'id',
            }
        },
        fieldName:{
            type:DataTypes.STRING(255),
            allowNull:false,  
        },
        fieldType:{
            type:DataTypes.STRING(20),
            allowNull:false,
        },
        label:{
            type:DataTypes.STRING(25),
            allowNull:false,
        },
        isRequired:{
            type:DataTypes.INTEGER,
            allowNull:false,
        },
    });
        return CustomFields;
}