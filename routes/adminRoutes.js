
const express = require('express');
const router = express.Router();
const { adminLogin, adminDashboard } = require('../controller/adminController');
const { route } = require('./userRoutes');


//////admin login

router.get('/adminlogin', (req, res) => {
  res.render('adminLogin', { success: null, error: null });
});

router.post('/adminlogin', adminLogin);

///////admin dashboard
 router.get('/adminDashboard', (req, res) => {
  res.render('adminDashboard', { success: null, users: [], error:null });
});
 router.post('/adminDashboard',adminDashboard);















module.exports = router;
