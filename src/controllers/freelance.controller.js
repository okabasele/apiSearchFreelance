const Freelance = require("../models/freelance.model");
const User = require("../models/user.model");

exports.register = async (req, res, next) => {
  try {
    const foundUser = await User.findOne({ email: req.body.email });
    if (foundUser) {
      return next(new Error("User already exists"));
    }

    const newUser = new User({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      password: req.body.password,
      email: req.body.email,
      address: req.body.address,
      city: req.body.city,
      postcode: req.body.postcode,
      phone: req.body.phone,
    });
    const newUserToSave = await newUser.save();

    const newFreelance = new Freelance({
      dailyWage: req.body.dailyWage,
      yearsExp: req.body.yearsExp,
      skills: req.body.skills,
      job: req.body.job,
      user: newUserToSave._id,
    });

    const newFreelanceToSave = await newFreelance.save();
    return res.send(newFreelanceToSave);
  } catch (err) {
   return next(err);
  }
};
