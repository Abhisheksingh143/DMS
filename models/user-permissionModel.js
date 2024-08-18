module.exports = function (sequelize, DataTypes) {
  const SubDepartmentPermission = sequelize.define("subDepartment_permission", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
    department_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "departments",
        key: "id",
      },
    },
    sub_department_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "sub_departments",
        key: "id",
      },
    },
    permission_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "permissions",
        key: "id",
      },
    },
  }, {
    indexes: [
      {
        unique: true,
        fields: ['user_id', 'sub_department_id', 'permission_id'],
        name: 'unique_user_sub_department_permission' // Custom name for the constraint
      }
    ]
  });

  return SubDepartmentPermission;
};
