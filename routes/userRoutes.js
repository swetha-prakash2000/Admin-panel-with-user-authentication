const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');

// Signup page
router.get('/signup', (req, res) => {
  res.render('signup', { success: null, error: null });
});

router.post('/signup', userController.postSignup);


//* /login page
 router.get('/login',(req,res)=>{
  res.render('login',{success : null,error : null});
})
router.post('/login',userController.postLogin);




///dashboard

 router.get('/dashboard', (req, res) => {
  res.render('dashboard', { user: req.user || null });
}); 


///forgot password

 router.get('/forgotPassword',(req,res)=>{
  res.render('forgotPassword',{success : null, error : null});
})

router.post('/forgotPassword',userController.forgotPassword)

////verify

router.get('/verify', (req, res) => {
  res.render('verify', { success: null, error: null });
});

router.post('/verify', userController.verify);


////reset password

router.get('/resetPassword',(req,res)=>{
  res.render('resetPassword',{success : null, error : null});
  
})

router.post('/resetPassword',userController.resetPassword)
 


////logout



router.get('/logout',(req,res)=>{
  res.render('postLogin',{success : null, error : null});
  
})
router.post('/logout',userController.postLogin)



















module.exports = router;