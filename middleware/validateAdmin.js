const {body,validationResult} = require("express-validator");




const   adminValidator = [

     body('email').isEmail().withMessage('Error in email'),
     body('password').isLength({min:4}).withMessage('Error in passwrod'),

     async(req,res,next)=>{

        const error = validationResult(req)
        if(!error.isEmpty()){
            req.validationErrors = error.array()
            // const firstError = error[0]
            // console.log('first error', firstError);
            
            console.log('error in validation',req.validationErrors);
            
        }
        next()
     }






]


module.exports = {adminValidator}