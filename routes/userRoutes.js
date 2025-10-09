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








































module.exports = router;