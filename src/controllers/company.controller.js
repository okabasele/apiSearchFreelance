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

exports.getAllCompanies = async (req, res, next) => {
  try {
    const allCompanies = await Company.find().populate({
      path: "user",
      select: ["firstname", "lastname", "city"],
    });
    return res.send(allCompanies);
  } catch (error) {
    return next(error);
  }
};

exports.getCompany = async (req, res, next) => {
  try {
    const foundCompany = await Company.findById(req.params.id);
    if (!foundCompany) {
      return next(new Error("User not found"));
    }
    res.send(foundCompany);
  } catch (error) {
    return next(error);
  }
};

exports.updateCompany = async (req, res, next) => {
  try {
    const foundCompany = await Company.findById(req.params.id);
    if (!req.userToken.isAdmin && req.userToken.id !== foundCompany.user._id) {
      return next(new Error("Not authorized."));
    }
    const updatedCompany = await Company.findByIdAndUpdate(
      req.params.id,
      req.body
    );
    if (!updatedCompany) {
      return next(new Error("User not found"));
    }
    res.send(updatedCompany);
  } catch (error) {
    return next(error);
  }
};

exports.deleteCompany = async (req, res, next) => {
  try {
    const foundCompany = await Company.findById(req.params.id);
    if (!req.userToken.isAdmin && req.userToken.id !== foundCompany.user._id) {
      return next(new Error("Not authorized."));
    }
    const deletedCompany = await Company.findByIdAndDelete(req.params.id);
    if (!deletedCompany) {
      return next(new Error("User not found"));
    }
    const deletedUser = await User.findByIdAndDelete(deletedCompany.user._id);
    res.send({ deletedCompany, deletedUser });
  } catch (error) {
    return next(error);
  }
};
