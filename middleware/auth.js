 /* const jwt = require("jsonwebtoken")

function getToken(req){
    return req.cookies?.token|| null
}

async function protectedAuth(req,res,next) {
    
     const Token = getToken(req)

     if(!Token){
        return res.redirect('/login')
     }
     

     try {
        const payload = jwt.verify(Token,process.env.JWT_SECRET)

        req.auth = payload
        console.log('Token worked')
        next()

      
     } catch (error) {
        console.error('Token not verified',error.message)
        return res.redirect('/login')
     }
}

 
 */

const jwt = require('jsonwebtoken');

function getToken(req) {
  return req.cookies?.token || null;
}

async function protectedAuth(req, res, next) {
  const token = getToken(req);

  if (!token) {
    return res.redirect('/login');
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.auth = payload;
    console.log('Token verified');
    next();
  } catch (error) {
    console.error('Token not verified', error.message);
    res.clearCookie('token');
    return res.redirect('/login');
  }
}

/* 
async function protectedAuthAdmin(req,res,next) {

    const adminToken = getToken(req)

    if(!adminToken){
      return res.redirect('/adminlogin')

    }

try {
   
const payload = jwt.verify(adminToken,process.env.JWT_SECRET)
           
     req.auth = payload
     
     next()  

} catch (error) {
   
  console.error('Token verification failed',error.message)
  return res.redirect('/adminlogin')

}


   
}
 */

async function protectedAuthAdmin(req, res, next) {
  const adminToken = req.cookies?.token;

  if (!adminToken) {
    return res.redirect('/adminLogin');
  }

  try {
    const payload = jwt.verify(adminToken, process.env.JWT_SECRET);
    req.auth = payload;
    next();
  } catch (error) {
    console.error('Token verification failed:', error.message);
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
    });
    return res.redirect('/adminLogin');
  }
}









module.exports = {

          protectedAuth,
          protectedAuthAdmin
}