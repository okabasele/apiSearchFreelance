const User = require("../models/user.model");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");

exports.login = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        // return res.status(404).send({ message: "User not found", });
        return next(
          new Error("User not found", {
            statusCode: 404,
          })
        );
      }
      let passwordValid = bcrypt.compareSync(req.body.password, user.password);
      if (!passwordValid) {
        // return res.status(401).send({
        //   message: "Password not valid",
        //   auth: false,
        // });
        return next(
          new Error("Password not valid", {
            statusCode: 401,
            auth: false,
          })
        );
      }
      let token = jwt.sign(
        {
          id: user.id,
          isAdmin: user.isAdmin,
        },
        process.env.TOKEN_SECRET
      );
      res.send({ message: "User logged in", auth: true, userToken: token });
    })
    .catch((err) => next(err));
};
