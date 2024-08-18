const express = require('express');
const path = require('path')
const app = express();
const superAdminRoutes = require('./routes/super-admin');
const adminRoutes = require('./routes/admin')
const authRoutes = require('./routes/auth/authRoutes')
const userRoutes = require("./routes/user/index")
const flash = require('connect-flash')
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store); // For storing sessions in DB
const db = require('./models/index')

const sessionStore = new SequelizeStore({
  db: db.sequelize,
});


app.use(
  session({
    secret: 'your-secret-key', // Change this to your secret key
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
    cookie: {
      maxAge: 30 * 60 * 1000, // 30 minutes
    },
  })
);

app.use(flash());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({extended:true}))

app.use('/', authRoutes);

app.use((req, res, next) => {

try{

  // return res.json(req.session.user)
  if (!req.session.user) {
    return res.redirect('/login');  // Stop further execution after redirect
  }
  
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg')
  res.locals.user = req.session.user;
  res.locals.error = req.flash('error');
  // console.log(res.locals)
  next();

}catch(err){
  console.log(err);
}
});
  

app.use('/super',(req, res, next) => {

  const user = req.session.user;
  if(!user) return res.redirect('/login');

  if(user.role === 'super-admin')
      next();
  else
    return res.redirect('back')

},  superAdminRoutes);

app.use('/admin',(req,res, next) => {

  const user = req.session.user;
  if(!user) return res.redirect('/login');

  if(user.role === 'admin')
      next();
  else
    return res.redirect('back')
},
  adminRoutes);

app.use('/users',userRoutes);

app.get('/',async(req, res)=>{

  res.send('HELLO')
})

app.use((req, res) => {
  res.status(404).send('Page Not Found');
});

app.listen(3000,()=>{

    // db.sequelize.sync().then(()=>{
    //     console.log('Server Running at port 3000 and table synced')
    // }).catch(error=>{
    //     console.log(error);
    // })
        console.log('Server Running at port 3000 and table synced')
    
})