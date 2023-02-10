function verifyIsFreelance(req, res, next) {
  if (req.userToken.isAdmin || req.userToken.role === "freelance") {
    return next();
  }
  return res
    .status(401)
    .send({ auth: false, message: "You must be a freelance" });
}

module.exports = verifyIsFreelance;
