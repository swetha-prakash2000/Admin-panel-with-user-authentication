const jwt = require("jsonwebtoken")

function getToken(req){
    return req.cookies?.token||req.cookies?.token||null
}

async function protectedAuth(req,res,next) {
    
     const Token = await getToken(req)

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
        return redirect('/login')
     }
}


async function protectedAuthAdmin(req,res,next) {

    const adminToken = req.cookies?.token

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























module.exports = {

          protectedAuth,
          protectedAuthAdmin
}