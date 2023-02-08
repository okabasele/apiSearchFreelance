function verifyIsCompany(req, res, next) {
  if (req.userToken.isAdmin || req.userToken.role === "company") {
    return next();
  }
  return res
    .status(401)
    .send({ auth: false, message: "You must be a company" });
}

module.exports = verifyIsCompany;
