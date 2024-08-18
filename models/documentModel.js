

module.exports = function(sequelize, DataTypes){

    const Document = sequelize.define('documents',{
        id:{
            type:DataTypes.INTEGER,
            autoIncrement:true,
            primaryKey:true
        },
        subDepartmentId:{
            type:DataTypes.INTEGER,
            allowNull:false,
            references:{
                model:'sub_departments',
                key: 'id'
            }
        },
        file_name:{
            type:DataTypes.STRING(255),
            allowNull:false
        },
        path:{
            type:DataTypes.STRING(255),
            allowNull:false,
        },
        custom_fields_data:{
            type:DataTypes.TEXT('long'),
            allowNull:true,
        }
    });

   
    return Document;
}