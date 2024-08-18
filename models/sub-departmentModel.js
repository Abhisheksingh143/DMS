

module.exports = function(sequelize, DataTypes){

    const SubDepartment = sequelize.define('sub_departments',{
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
          },
          department_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
              model: 'departments', // assuming 'departments' is your departments table name
              key: 'id'
            }
          },
          sub_department_name: {
            type: DataTypes.STRING(100),
            allowNull: false
          }
        }, {
          uniqueKeys: {
            unique_sub_department: {
              fields: ['department_id', 'sub_department_name']
            }
          }
        });

    return SubDepartment;
}