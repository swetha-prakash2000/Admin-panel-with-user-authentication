
const express = require('express');
const router = express.Router();
const { adminLogin, adminDashboard, blockUser } = require('../controller/adminController');
const { updateUser,addUser,deleteUser,logoutAdmin} = require('../controller/adminController')
const { adminValidator} = require('../middleware/validateAdmin');
const {protectedAuthAdmin} = require('../middleware/auth');


//-----------------admin login

router.get('/adminlogin', (req, res) => {
  res.render('adminLogin', { success: null, error: null });
});

router.post('/adminlogin',adminValidator,adminLogin);




//----------------------admin dashboard

router.get('/adminDashboard', protectedAuthAdmin, adminDashboard);



//--------------------add user

router.post('/add-user',protectedAuthAdmin, addUser)


//---------------------update user

router.post('/update-user',protectedAuthAdmin,updateUser)


//-----------------------delete user

router.post('/delete-user',protectedAuthAdmin,deleteUser)

//-----------------------block user

router.post('/block-user/:id',protectedAuthAdmin,blockUser)




//------------------logout

 router.post('/logoutAdmin',logoutAdmin) 
 
//router.post('/logoutAdmin', adminController.logoutAdmin);


module.exports = router;
