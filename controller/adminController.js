
const adminModel = require('../models/admin');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

async function adminLogin(req, res) {
  const { email, password } = req.body;

  try {
    const admin = await adminModel.findOne({ email });

    if (!admin) {
      return res.render('adminLogin', { success: null, error: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.render('adminLogin', { success: null, error: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: admin._id, email: admin.email, role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.cookie('token', token, { httpOnly: true });

return res.render('adminDashboard', {
      success: 'Welcome back, Admin!',
      admin
    });


    //return res.redirect('/adminDashboard');

  } catch (error) {
    console.error(error);
    res.render('adminLogin', { success: null, error: 'Server error' });
  }
}


////////admin dashboard


 async function adminDashboard(req,res) {
  try {
    
    const users = await User.findOne({}).sort({createdAt : -1})

    res.render('adminDashboard',{users : [] , success : null, error : null});


  } catch (error) {

    console.error(error);
    res.render('adminDashboard',{users : [], success : null, error : null})
    
  }
 }










module.exports = {
    adminLogin,
    adminDashboard
   
   
}