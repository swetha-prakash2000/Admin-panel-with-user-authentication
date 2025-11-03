const { body, validationResult } = require("express-validator");

const adminValidator = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Enter a valid email'),
   

  body('password')
     .trim()
     .notEmpty().withMessage('Password is required')
    .isLength({ min: 4 })
    .withMessage('Password must be at least 4 characters long'),

  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const firstError = errors.array()[0].msg;
      console.log('Validation error:', errors.array());
      console.log('Login validator triggered');

      return res.status(400).render('adminlogin', {
        success: null,
        error: firstError
      });
    }

    next();
  }
];





module.exports = {adminValidator}