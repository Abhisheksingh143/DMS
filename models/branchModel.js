
module.exports = function(sequelize, DataTypes){
   const Branch = sequelize.define('branches', {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        branch_name: {
          type: DataTypes.STRING(20),
          allowNull: false
        },
        // adminId: {
        //   type: DataTypes.INTEGER,
        //   allowNull: false,
        //   references: {
        //     model: 'users', // assuming 'users' is your users table name
        //     key: 'id'
        //   }
        // },
        address: {
          type: DataTypes.STRING(255)
        }
      });

     

      return Branch;
}