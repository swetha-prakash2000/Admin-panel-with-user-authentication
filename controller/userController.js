
require('dotenv').config();
const User = require('../models/user');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer")


//signup
async function postSignup(req, res) {
  try {
    const { name, email, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      return res.render('signup', { success: null, error: 'Passwords do not match' });
    }
    
   const existingUser = await User.findOne({email});

   if(existingUser){
    return res.render('signup',{success : null, error : 'Email already registered'})
   }


    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      user_name: name,
      email,
      password: hashedPassword
    });

    await newUser.save();
    res.render('signup', { success: 'User registered successfully!', error: null });

  } catch (err) {
    console.error(err);
    res.render('signup', { success: null, error: 'Error registering user' });
  }
}


//login


async function postLogin(req,res) {
  try {
    const{email,password} = req.body;
   
   
    const user = await User.findOne({email});
   if(!user){
    return res.render('login',{success : null, error : 'User doaes not exist'})
   }
   if(user.isBlock){
    return res.render('login',{success : null, error : 'You are blocked by admiin'})
   }
   
    const isMatch = await bcrypt.compare(password,user.password)

    if(!isMatch){
      return res.render('login',{success : null, error : 'Invalid password'})
    }

  const token = jwt.sign({id:user._id,email : user.email},process.env.JWT_SECRET,{expiresIn:'1d'})

   res.cookie('token',token,{
    httpOnly : true,
    maxAge:24*60*60*1000
   })

   res.render('dashboard',{user: user,success : null, error : null})
    

  } catch (error) {
    console.log('error from postLogin',error.message,error.stack);
    
    return res.render('login',{success : null, error :'Error during login'})
  }
  
}


////dashboard
async function Dashboard(req,res) {
  const user = await User.findById(req.auth._id)

  console.log('function from dashboard', user);
  
  if(!user){
    return res.render('login',{success : null, error : 'User not found'})
  }
  return res.render('dashboard',{user, success : null, error : null})
}



////forgot password

async function forgotPassword(req, res) {
  const { email } = req.body;

  try {
    console.log("EMAIL_USER:", process.env.EMAIL_USER);
    console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "Loaded" : "Missing");

    
    const user = await User.findOne({ email });
    if (!user) {
      return res.render("forgotpassword", {
        success: null,
        error: "User not found",
      });
    }

    
    const otp = Math.floor(100000 + Math.random() * 900000);
    console.log("Generated OTP:", otp);
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); 

    user.resetOtp = otp;
    user.otpExpires = expiresAt;
    await user.save();

    
    const transporter = nodemailer.createTransport({
      service: "gmail", 
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

   
    
    await transporter.sendMail({
      from: `"My App" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your OTP to reset password",
      html: `<p>Your OTP is <b>${otp}</b>. It expires in 5 minutes.</p>`,
    });

    
    res.render("verify", {
      email,
      success : null,
      error : null,
      message: "OTP sent to your email successfully",
    });
  } catch (error) {
    console.error(" Error forgot password:", error.message,error.stack);
    res.render("verify", { success: null, error: "Failed to send OTP. Try again later." });
  }
}


/////verify otp


async function verify(req, res) {
  const { email, digit1, digit2, digit3, digit4, digit5, digit6 ,} = req.body;
  console.log('verify - req.body = ', req.body);
  
  const otpJoin = `${digit1}${digit2}${digit3}${digit4}${digit5}${digit6}`;

  try {
    const user = await User.findOne({ email });

    
    if (!user || Number(otpJoin) !== user.resetOtp || user.otpExpires < new Date()) {
      return res.render("resetPassword", {
        email,            
        userId: null,     
        success: null,
        error: "Invalid OTP or email"
      });
    }

    
    // console.log('Rendering resetPassword with:', {
    //   email: user.email,
    //   userId: user._id
    // });

    return res.render("resetPassword", { 
      userId: user._id,
      email: user.email,
      success: "OTP verified successfully. You can now reset your password.",
      error: null,
      message: null
    });

  } catch (error) {
    console.error("Error from verifyOtp:", error.message, error.stack);
    return res.render("verify", {   
      success: null,
      error : null
      
    });
  }
}


////////reset password

  
async function resetPassword(req, res) {


 const { id, email, password, confirmPassword } = req.body;
console.log(' restPassword - req body =', req.body);

  try {
    // const userNew = await User.findOne({user : email.id})
    // console.log('restPassword', userNew);
    
    if (password !== confirmPassword) {
      return res.render('resetPassword', {
        email,
        userId: id, 
        message: 'Passwords do not match',
        success: null,
        error: null
      });
    }

    
    const hashedPassword = await bcrypt.hash(password, 10);


      const user = await User.findByIdAndUpdate(id, { password: hashedPassword }, { new: true });

    if (!user) {
      return res.render('resetPassword', {
        email,
        userId: id,
        message: 'User not found',
        success: null,
        error: null
      });
    }

    console.log('Password updated for', user.email);

    
    return res.redirect('/login');

  } catch (error) {
    console.error('Error during reset password:', error.message, error.stack);

    
    return res.render('resetPassword', {
      email,
      userId: id,
      message: 'Something went wrong. Please try again.',
      success: null,
      error: null
    });
  }
}

 




///////user logout

 const logout = (req,res)=>{
  res.clearCookie('token')
  res.redirect('/postLogin')
  
}









module.exports = { postSignup,
                   postLogin,
                   Dashboard,
                   forgotPassword,
                   verify,
                   resetPassword,
                   logout

 }
