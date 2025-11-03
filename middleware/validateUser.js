const {body,validationResult} = require("express-validator");
const User = require('../models/user');

 //--------------------------signup validator

 const signupValidator = [
    body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({min:3}).withMessage('Name must be at least 3 characters'),
    
    body('email')
    .trim()
    .isEmail().withMessage('Enter a valid email address'),

    body('password')
    .trim()
    .notEmpty().withMessage('Password is required')
    .isLength({min:5}).withMessage('Password must be at least 5 characters'),
    
    body('confirmPassword')
    .trim()
    .isLength({min:4}).notEmpty(),


    async(req,res,next)=>{
        const error = validationResult(req);
        
        if(!error.isEmpty()){
           const firstError = error.array()[0].msg
           console.log('validation - error,', error);
           
           console.log('signup validator hits');
            return res.status(400).render('signup',{success : null, error : firstError})
            
        }
        next()
    }
]
  



//--------------------------------login validator

const loginValidator = [
      
    body('email')
    .trim()
    .isEmail().withMessage('Enter a valid email address'),

    body('password')
    .trim()
    .notEmpty()
    .isLength({min:5}).withMessage('Password must be at least 5 characters'),
    


    async(req,res,next)=>{
      
        const error = validationResult(req);

        if(!error.isEmpty()){
            const firstError = error.array()[0].msg
            console.log('validation - error',error)
            console.log('login validator hits');

            return res.status(400).render('login',{success : null, error : firstError})
        }
         next()
    }

]






module.exports = { signupValidator ,
                   loginValidator

};
