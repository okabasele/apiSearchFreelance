const User = require("../models/user.model");
const Company = require("../models/company.model");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");

exports.login = async (req, res, next) => {
  try {
    //Recuperer l'utilisateur
    const foundUser = await User.findOne({ email: req.body.email });
    //Verifier s'il existe
    if (!foundUser) {
      return next(
        new Error("User not found", {
          statusCode: 404,
        })
      );
    }

    //Savoir si l'utilisateur est une entreprise ou un freelance
    var role = "";
    const foundCompany = await Company.findOne({ user: foundUser._id });
    if (foundUser.isAdmin) {
      role = "admin";
    } else if (foundCompany) {
      role = "company";
    } else {
      role = "freelance";
    }

    //Si l'utilisateur existe on déchiffre le mot de passe
    let passwordValid = bcrypt.compareSync(req.body.password, foundUser.password);
    if (!passwordValid) {
      return next(
        new Error("Password not valid", {
          statusCode: 401,
          auth: false,
        })
      );
    }

    //On crée le token
    let token = jwt.sign(
      {
        id: foundUser._id,
        role: role,
        isAdmin: foundUser.isAdmin,
      },
      process.env.TOKEN_SECRET
    );
    res.send({ message: "User logged in", auth: true, userToken: token });
  } catch (error) {
    next(error);
  }

};
