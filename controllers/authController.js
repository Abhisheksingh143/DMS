const {User}  = require('../models/index')
const bcrypt = require('bcrypt');
const saltRounds = 10;

const getLoginPage = (req, res) => {

    res.render('auth/login')

}

const postLogin = async(req, res) => {

   try{
    
    //1. check if data valid
    const {email, password} = req.body;
    if(!email || !password) throw new Error('Please enter email and password')

    //find user if exists
    const user = await User.findOne({
        where:{
            email:email
        }
    });

    if (!user) {
        // console.log(user)
        req.flash('error_msg', 'Invalid email or password');
        return res.redirect('/login');
      }

    //2. if exists then check password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if(!passwordMatch) throw new Error('Incorrect Password')
    
    //3 store user to session;
     req.session.user = user;

    //4. password match so login him and redirect according to role
    // req.flash('success_msg', 'You are now logged in');
    if (req.session.user.role === 'super-admin') {
        return res.status(200).redirect('/super');
    } else if (req.session.user.role === 'admin') {
        return res.status(200).redirect('/admin');
    } else if (req.session.user.role === 'user') {
        return res.status(200).redirect('/users');
    }

   }catch(err){
    console.log(err)
    req.flash('error_msg', err.message);
    res.json(err.message);
   }
}


const postLogout = async(req, res) => {
  const result = req.session.destroy();
  if(!result){
    req.flash('Something went Wrong')
    return res.redirect('back')
  }

    res.clearCookie('connect.sid');
    req.flash('success_msg', 'You are logged out');
    res.redirect('/login');

}


module.exports = {
    getLoginPage,
    postLogin,
    postLogout,

}


//https://chatgpt.com/share/12dae87a-4aa1-44fb-b132-0c411f9e4c97