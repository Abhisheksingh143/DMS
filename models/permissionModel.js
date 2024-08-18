
module.exports = function(sequelize, DataTypes){
    const PermissionModel = sequelize.define('permissions',{
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
          },
          permission_name: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true
          }
    })

    return PermissionModel;
}