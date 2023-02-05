const Company = require("../models/company.model");
const User = require("../models/user.model");

exports.register = async (req, res, next) => {
  try {
    //Verifier que l'utilisateur n'existe pas et que le job id et skills id existent
    const foundUser = await User.findOne({ email: req.body.email });
    if (foundUser) {
      return next(new Error("User already exists"));
    }
    //création de l'utilisateur
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

    //création de l'entreprise
    const newCompany = new Company({
      name: req.body.name,
      status: req.body.status,
      siret: req.body.siret,
      user: newUserToSave._id,
    });

    const newCompanyToSave = await newCompany.save();
    return res.send(newCompanyToSave);
  } catch (err) {
    return next(err);
  }
};
