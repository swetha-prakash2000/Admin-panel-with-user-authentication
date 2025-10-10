const User = require('../models/user');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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


async function forgotPassword(req,res) {
  const {email} = req.body
   
  try {
    
          const user = await User.findOne({email})
          if(!user){
            return res.render('user/forgotpassword',{success : null, error : 'User not found'})
          }

            const otp = Math.floor(100000 + Math.random() * 900000)
            console.log(otp);
            const expiresAt = new Date(Date.now()+5*60*10000)

            user.resetOtp = otp
            user.otpExpires = expiresAt
            await user.save()

       const transport = nodemailer.createTransport({
               
               service : "gamil",
               secure : true,
               auth : {
                user : process.env.MY_GMAIL,
                pass : process.env.MY_PASSWORD
               }

       })
      
     await transport.sendMail({
        from : `"My App"<${process.env.SMPT_USER}>`,
        to : email,
        subject : "Your otp to reset password",
        html : `<p> Your otp is <b>${otp}</b>.It expires in 5mins.</p>`

     })
     res.render('user/enterOtp',{email,message : 'Otp send to your mail'})

     const showOtpForm = (req,res)=>{
      res.render('user/enterOtp',{email : req.query.email})
     }
       
           
      
            


          












  } catch (error) {
    
  }


}









module.exports = { postSignup,
                   postLogin,
                   Dashboard,
                   forgotPassword,
 };
