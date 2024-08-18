

module.exports = function(sequelize, DataTypes){

    const Department = sequelize.define('departments',{
        id:{
            type:DataTypes.INTEGER,
            autoIncrement:true,
            primaryKey:true
        },
        branchId:{
            type:DataTypes.INTEGER,
            allowNull:false,
            references:{
                model:'branches',
                key: 'id'
            }
        },
        department_name:{
            type:DataTypes.STRING(50),
            allowNull:false
        },
    });

   
    return Department;
}