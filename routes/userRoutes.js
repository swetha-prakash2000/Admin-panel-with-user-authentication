const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');

// Signup page
router.get('/signup', (req, res) => {
  res.render('signup', { success: null, error: null });
});

router.post('/signup', userController.postSignup);


//login page
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



///verify
router.get('/verify',(req,res)=>{
  res.render('verify',{success : null, error : null});

})



////reset password

router.get('/resetpassword',(req,res)=>{
  res.render('resetpassword',{success : null, error : null});

})


























module.exports = router;