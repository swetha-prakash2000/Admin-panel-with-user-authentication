
const adminModel = require('../models/admin');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
 const bcrypt = require('bcrypt');


//----------------------------admin login

async function adminLogin(req, res) {
  const { email, password } = req.body;
  console.log('req.body', req.body);

  try {
    const admin = await adminModel.findOne({ email });

    if (!admin || password !== admin.password) {
      return res.render('adminLogin', { success: null, error: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: admin._id, email: admin.email, role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000,
    });

    
    return res.redirect('/adminDashboard');

  } catch (error) {
    console.error(error);
    res.render('adminLogin', { success: null, error: 'Server error' });
  }
}



//---------------------------------admin dashboard

async function adminDashboard(req, res) {
  try {
    
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');

    const users = await User.find().sort({ createdAt: -1 });
    res.render('adminDashboard', { users, success: null, error: null });

  } catch (error) {
    console.error(error);
    res.render('adminDashboard', { users: [], success: null, error: 'Cannot load users' });
  }
}



//----------------------------------------add user


async function addUser(req, res) {
  try {
    const { user_name, email, password } = req.body;
    console.log('addUser - req.body = ', req.body);
    
     const existingUser = await User.findOne({ email });
    if (existingUser) {
      const users = await User.find();
      return res.render('adminDashboard', { users, success: null, error: 'User already exists.' });
    }



    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      user_name,
      email,
      password: hashedPassword
    });

    return res.redirect('/adminDashboard');

  } catch (error) {
    console.error('Error adding user',error.message);
    const users = await User.find();
    res.render('adminDashboard', { users, success: null, error: 'Failed to add user. Check all fields.' });
  }
}



//-------------------------------------update user

async function updateUser(req,res) {

  try {
    

     const{id, email, password} = req.body

      
     const existingUser = await User.findOne({ email });
    if (existingUser) {
      const users = await User.find();
      return res.render('adminDashboard', { users, success: null, error: 'User already exists.' });
    }


     const hashedPassword = await bcrypt.hash(password,10)
     await User.findByIdAndUpdate(id, {email, password:hashedPassword})

     return res.redirect('/adminDashboard')


  } catch (error) {
    console.error('Error updating user',error.message);
    const users = await User.find()
    res.render('adminDashboard',{users, success : null, error : null})

  }
}

//--------------------------------delete user

async function deleteUser(req,res) {
  
  try {
    
    const{id} = req.body
    await User.findByIdAndDelete(id)

   return res.redirect('/adminDashboard')


  } catch (error) {
    console.error('Error deleting user',error.message)
    const users = await User.find();
    res.render('adminDashboard',{users , success : null, error : null})
  }
}


//------------------------------------block

async function blockUser(req,res) {

  try {
    
    const user = await User.findById(req.params.id)
    
     
    if(user){
      user.isBlock = !user.isBlock
      await user.save()
    }
    const users = await User.find();

    return res.render('adminDashboard',{users, success : null , error : null})
     
   

  } catch (error) {
    
    console.error(error)
    const users = await User.find();
   return res.render('adminDashboard',{users, success : null , error : error})
  }
  
}


//-------------------------------logout





const logoutAdmin = (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
  });
  
  res.cookie('token', '', { expires: new Date(0), path: '/' });

  res.redirect('/adminLogin');
};









module.exports = {
    adminLogin,
    adminDashboard,
    addUser,
    updateUser,
    deleteUser,
    blockUser,
    logoutAdmin
   
   
}