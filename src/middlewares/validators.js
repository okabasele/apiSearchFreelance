const { body, validationResult } = require("express-validator");

exports.checkEmail = [
  body('email').isEmail().withMessage("Email format not valid")
]

exports.checkIdentity = [
  body('firstname').isAlphanumeric().withMessage('firstName format is not valid'),
  body('lastname').isAlphanumeric().withMessage('lastName format is not valid')
]

exports.checkPassword = [
  body('password')
    .notEmpty()
    .isLength({ min: 8})
    .matches(/^[A-Za-z0-9 .,'!&(§è!çà)]+$/)
    .withMessage("Password should be at least 8 characters long.")
]

exports.checkSiret = [
  body('siret')
    .notEmpty()
    .isLength({ min: 9, max: 9 })
    .isNumeric()
    .withMessage("Siret should have 9 numbers")
]


exports.validation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // return res.status(400).json({ errors: errors.array() });
    return next(errors)
  }
  next();
};
