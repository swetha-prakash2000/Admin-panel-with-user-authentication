const jwt = require("jsonwebtoken")

function getToken(req){
    return req.cookies?.userToken||req.cookies?.adminToken||null
}

async function protectedAuth(req,res,next) {
    
     const Token = await getToken(req)

     if(!Token){
        return redirect('/login')
     }
     

     try {
        const payload = jwt.verify(token,process.env.JWT_SECRET)

        req.auth = payload
        console.log('Token worked')
        next()

      
     } catch (error) {
        console.error('Token not verified',error.message)
        return redirect('/login')
     }
}

























module.exports = {

          protectedAuth,
}