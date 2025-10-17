const {body,validationResult} = require("express-validator");
const User = require('../models/user');
 
const signupValidator = [
    body('name').isLength({min:3}),
    body('email').isEmail(),
    body('password').isLength({min:4}),
    body('confirmPassword').isLength({min:4}),


    async(req,res,next)=>{
        const error = validationResult(req);
        if(!error.isEmpty()){
            console.log('signup validator hits');
            return res.status(400).render('signup',{success : null, error : null})
            
        }
        next()
    }
]



const loginValidator = [
      
    body('email').isEmail(),
    body('password').isLength({min:4}),


    async(req,res,next)=>{
      
        const error = validationResult(req);

        if(!error.isEmpty()){
            console.log('login validator hits');

            return res.status(400).render('login',{success : null, error : null})
        }
         next()
    }

]






module.exports = { signupValidator ,
                   loginValidator

};