
const express = require('express');
const router = express.Router();
const { adminLogin, adminDashboard, blockUser } = require('../controller/adminController');
const { updateUser,addUser,deleteUser,logoutAdmin} = require('../controller/adminController')
const { adminValidator} = require('../middleware/validateAdmin');
//const {protectedAuthAdmin} = require('../middleware/auth');

// const { route } = require('./userRoutes');
// const { loginValidator } = require('../middleware/validateUser');


//////admin login

router.get('/adminlogin', (req, res) => {
  res.render('adminLogin', { success: null, error: null });
});

router.post('/adminlogin',adminValidator,adminLogin);




///////admin dashboard
/*  router.get('/adminDashboard', (req, res) => {
  res.render('adminDashboard', { success: null, users: [], error:null });
}); */
 router.get('/adminDashboard',adminDashboard);


//  router.get('/adminDashboard',protectedAuthAdmin,(req,res)=>{

//   res.render('adminDashboard',{admin:req.auth})
//  })





////////add user

router.post('/add-user', addUser)


//////////update user

router.post('/update-user',updateUser)


///////////delete user

router.post('/delete-user',deleteUser)

//////////block user

router.post('/block-user/:id',blockUser)



//  router.get('/logoutAdmin', (req, res) => {
//    res.render('adminLogin', { success: null, error: null })
//  })

router.get('/logoutAdmin',logoutAdmin)


module.exports = router;
