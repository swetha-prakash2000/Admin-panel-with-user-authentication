
const adminModel = require('../models/admin');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

async function adminLogin(req, res) {
  const { email, password } = req.body;
  console.log('req.body', req.body);
  

  try {
    const admin = await adminModel.findOne({ email });


    if (!admin||password!==admin.password) {
      return res.render('adminLogin', { success: null, error: 'Invalid email or password' });
    }

    
    const token = jwt.sign(
      { id: admin._id, email: admin.email, role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );


  

 
res.cookie('token', token, { httpOnly: true });
return res.redirect('/adminDashboard');

    //return res.redirect('/adminDashboard');

  } catch (error) {
    console.error(error);
    res.render('adminLogin', { success: null, error: 'Server error' });
  }
}


////////admin dashboard


 async function adminDashboard(req,res) {
  try {
    
    const users = await User.find().sort({createdAt : -1})
    

    res.render('adminDashboard',{users , success : null, error : null});

     
  } catch (error) {

    console.error(error);
    res.render('adminDashboard',{users : [], success : null, error : 'Can not load users'})
    
  }
 }

/////////add user


async function addUser(req, res) {
  try {
    const { user_name, email, password } = req.body;
    console.log('addUser - req.body = ', req.body);
    

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      user_name,
      email,
      password: hashedPassword
    });

    res.redirect('/adminDashboard');

  } catch (error) {
    console.error(error);
    const users = await User.find();
    res.render('adminDashboard', { users, success: null, error: 'Failed to add user. Check all fields.' });
  }
}



///////update user

async function updateUser(req,res) {

  try {
    

     const{id, email, password} = req.body
     const hashedPassword = await bcrypt.hash(password,10)
     await User.findByIdAndUpdate(id, {email, password:hashedPassword})
     res.redirect('/adminDashboard')


  } catch (error) {
    console.error(error);
    const users = await User.find()
    res.render('adminDashboard',{users, success : null, error : null})

  }
}

/////////delete user

async function deleteUser(req,res) {
  
  try {
    
    const{id} = req.body
    await User.findByIdAndDelete(id)

    res.redirect('/adminDashboard')


  } catch (error) {
    console.error(error)
    const users = await User.find();
    res.render('adminDashboard',{users , success : null, error : null})
  }
}


//////////block

async function blockUser(req,res) {

  try {
    
    const user = await User.findById(req.params.id)
    
     
    if(user){
      user.isBlock = !user.isBlock
      await user.save()
    }
    const users = await User.find();

     res.render('adminDashboard',{users, success : null , error : null})
     
    // res.redirect('/adminDashboard')

  } catch (error) {
    
    console.error(error)
    const users = await User.find();
    res.render('adminDashboard',{users, success : null , error : error})
  }
  
}


///////logout




const logoutAdmin = (req, res) => {
  res.clearCookie('token')
  res.redirect('/adminLogin')
}











module.exports = {
    adminLogin,
    adminDashboard,
    addUser,
    updateUser,
    deleteUser,
    blockUser,
    logoutAdmin
   
   
}