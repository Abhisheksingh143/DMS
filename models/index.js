const {Sequelize, DataTypes} = require('sequelize');
const config = require('../config');


const sequelize = new Sequelize(
    config.db_credential.database,
    config.db_credential.username,
    config.db_credential.password,
    {
        host:config.db_credential.host,
        dialect:config.db_credential.dialect
    }
)

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;


const Branch = require('./branchModel')(sequelize, DataTypes);
const User = require('./userModel')(sequelize, DataTypes);
const Department = require('./departmentModel')(sequelize, DataTypes);
const SubDepartment = require('./sub-departmentModel')(sequelize, DataTypes);
const Permission = require('./permissionModel')(sequelize, DataTypes);
const SubDepartmentPermission = require('./user-permissionModel')(sequelize, DataTypes);
const CustomField =  require('./customFieldModel')(sequelize, DataTypes);
const Document = require('./documentModel')(sequelize, DataTypes);


//asscociations

Branch.hasMany(User, { foreignKey: 'branch_id', onDelete: 'CASCADE' });

Branch.belongsTo(User, { as: 'admin', foreignKey: 'adminId', constraints: false }); 

Branch.hasMany(Department,
    {
        foreignKey:'branchId',
        onDelete: 'CASCADE',
    });


//department Asscociations

Department.belongsTo(Branch,
    {
        foreignKey:'branchId',
         onDelete:'CASCADE',
    });


//sub-department asscociation

Department.hasMany(SubDepartment,
    {
        foreignKey:'department_id',
        onDelete:'CASCADE',
    });


SubDepartment.belongsTo(Department,
    {
        foreignKey:'department_id',
    });


// user 

User.belongsTo(Branch,{foreignKey:'branch_id'});

User.hasMany(SubDepartmentPermission,
    {
        foreignKey:'user_id',
    }
);

User.belongsToMany(Department, {
    through:SubDepartmentPermission,
    foreignKey: 'user_id',
    as: 'departments',
    otherKey: 'department_id',
});

    


// SubDepartmentPermission

SubDepartmentPermission.belongsTo(SubDepartment, 
    { 
        foreignKey: 'sub_department_id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    });
SubDepartmentPermission.belongsTo(Department, 
    { 
        foreignKey: 'department_id'
     });


// SubDepartment.js
SubDepartment.hasMany(SubDepartmentPermission, 
    { 
        foreignKey: 'sub_department_id', 
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      
    });

SubDepartment.hasMany(Document,
    {
        foreignKey:'subDepartmentId',
        onDelete:'CASCADE',
    })

SubDepartment.hasMany(CustomField, 
    {
        foreignKey:'sub_department_id', 
        onDelete:'CASCADE'
    });


// Permission.js
Permission.hasMany(SubDepartmentPermission, 
    { 
        foreignKey: 'permission_id' 
    });

    SubDepartmentPermission.belongsTo(Permission,
     { 
        foreignKey: 'permission_id' 
    });





//Sub-department and custom fields
CustomField.belongsTo(SubDepartment, {foreignKey:'sub_department_id'});


//document 


Document.belongsTo(SubDepartment,
    {
        foreignKey:'subDepartmentId',
    })





    

db.Branch = Branch;
db.User = User;
db.Department = Department;
db.SubDepartment = SubDepartment;
db.Permission = Permission;
db.SubDepartmentPermission = SubDepartmentPermission;
db.CustomField = CustomField;
db.Document = Document;
module.exports = db;
