module.exports = function(sequelize, DataTypes){
    const User = sequelize.define('user', {
        username: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        email: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
          validate: {
            isEmail: true,
          },
        },
        mobile_no: {
          type: DataTypes.STRING,
          allowNull: true,
          unique: true,
          validate: {
            is: /^[0-9]{10}$/, // Assuming mobile number is 10 digits
          },
        },
        role: {
          type: DataTypes.STRING(20),
          allowNull: false,
        },
        password: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        status: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        branch_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references:{
            model:'Branches',
            key:'id',
          },
        },
      });
      return User;
}