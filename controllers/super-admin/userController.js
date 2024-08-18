const db = require("../../models/index");
const {User, Branch} = db;
const bcrypt = require('bcrypt');
const saltRounds = 10;

const getUsers = async function (req, res) {  

try {

  const userRole = req.session.user.role;
  let users;
  // return res.json(req.session.user)
  if(userRole === 'super-admin'){
   users = await User.findAll({
    attributes:['id','username','role','status'],
    include:[
      {
        model:Branch,
        attributes:['id','branch_name'],
      }
    ]
  })

  }else if(userRole === 'admin'){
    const branchId = req.session.user.branch_id;
     users = await User.findAll({
      where:{'branch_id' : branchId},
      attributes:['id','username','role','status'],
      include:[
        {
          model:Branch,
          attributes:['id','branch_name'],
        }
      ]
    })
  }

  // return res.json(users)
  res.render("users/index",{users});
} catch (error) {
  console.error(error)
}
};

const editUser = async(req, res) =>{

try {

  const userId = req.params.id;
  if (!userId) {
    return res.status(400).json({ error: 'ID parameter is required' });
  }

  const userData = await User.findByPk(userId);
  if(!userData) return res.status(500).send('No user found');

  const loginUser = req.session.user;

  let branches;

  if(loginUser.role === 'super-admin'){

    branches = await Branch.findAll()

  }else if(loginUser.role === 'admin'){

    branches = await Branch.findAll({
      where:{adminId : loginUser.id}
    })
  }

  res.render('users/create-user',{userData, branches, mode:'edit'})

} catch (error) {
    res.status(500).send(error);
}

}


const createUser = async (req, res) => {

  const userId = req.session.user.id;

  const user = await User.findByPk(userId);
  if(!user) throw new Error('No user found')

  let branches;
  if(user.role === 'super-admin') 
    branches = await Branch.findAll();
  else if(user.role === 'admin')
      branches = [await user.getBranch()];
  res.render("users/create-user",{branches, mode:'create'});
};

const postCreateUser = async (req, res) => {
  try {
   
    const userId = req.params.id;
    const {
      username, email, mobile_no,
      role, password, cnf_password, status, branch: branch_id
    } = req.body;

    // Parse status and branch_id as integers
    const parsedStatus = parseInt(status, 10);
    const parsedBranchId = parseInt(branch_id, 10);

    // Validate role
    const roles = ['admin', 'super-admin', 'user'];
    const isRoleValid = roles.includes(role);
    if (!isRoleValid) throw new Error('Role is invalid');
 

    let hashedPassword;
    if (password && cnf_password) {
      if (password !== cnf_password) throw new Error('Passwords must match');
      hashedPassword = await bcrypt.hash(password, 10);
    }

    let user;

    if (userId) {

      // Update existing user
      const updateData = {
        username,
        role,
        status: parsedStatus,
        branch_id: parsedBranchId,
      };

      if (hashedPassword) {
        updateData.password = hashedPassword;
      }
    
      user = await User.update(updateData, {
        where: { id: userId }
      });

    } else {
    
      // Create new user
      user = await User.create({
        username,
        email,
        mobile_no,
        role,
        password: hashedPassword,
        status: parsedStatus,
        branch_id: parsedBranchId
      });
      
    }
    if (!user) {
      throw new Error('Something went Wrong')
    } 

    if(req.session.user.role === 'admin')
        return res.redirect('/admin/users')
    else if(req.session.user.role === 'super-admin')
        return res.redirect('/super/users');

  } catch (error) {
    res.json(error)
  }
};

const deleteUser = async(req, res) => {

  try {

    const userId = req.params.id;

    const user = await User.destroy({
      where:{id:userId},
    })

    if(!user) throw new Error('No user found');

    return res.status(200).redirect('back');

  } catch (error) {
      console.log(error)
  }

}


module.exports = {
  createUser,
  getUsers,
  postCreateUser,
  editUser,
  deleteUser,
};



//first take inputs
//them process them
   /** Update
    * then check if password and cnf_password present
    *   if yes then compare  
    *     if correct hashed them
    *   
    *   if password is available then only update else dont update 
    *       
    */

/** Create
 * if create
 * take inputs
 * check if data is valid
 * then check if password and cnf_password is present 
 *    if yes then compare them 
 *        if correct hashed them
 *    else throw error saying password didnt matched
 * 
 */