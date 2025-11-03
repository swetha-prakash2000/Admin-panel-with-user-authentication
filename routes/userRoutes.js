const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');
const {protectedAuth} = require('../middleware/auth');
const { signupValidator, loginValidator } = require('../middleware/validateUser');
// const user = require('../models/user');





// ------------------Signup page

router.get('/signup', (req, res) => {
  res.render('signup', { success: null, error: null });
});

router.post('/signup', signupValidator,userController.postSignup);


//-------------------------login page

 router.get('/login',(req,res)=>{
  
  res.render('login',{success : null,error : null});
})
router.post('/login',loginValidator,userController.postLogin);



//--------------------dashboard

/* 
router.get('/dashboard', protectedAuth, (req, res) => {
  res.render('dashboard', { user: req.user });
});

 */
router.get('/dashboard', protectedAuth,userController.Dashboard);

//-------------------------forgot password

 router.get('/forgotPassword',(req,res)=>{
  res.render('forgotPassword',{success : null, error : null});
})

router.post('/forgotPassword',userController.forgotPassword)

//-------------------------------------verify

router.get('/verify', (req, res) => {
  res.render('verify', { success: null, error: null });
});

router.post('/verify', userController.verify);


//----------------------------reset password

router.get('/resetPassword',(req,res)=>{
  res.render('resetPassword',{success : null, error : null});
  
})

router.post('/resetPassword',userController.resetPassword)
 


//--------------------------logout


/
router.post('/logout',userController.logout);












module.exports = router;


