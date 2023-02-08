var jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

function verifyToken(req, res, next) {
  //récupérer le token
  const [,token] = req.headers.authorization.split(' ');

  //si pas de token : erreur 404
  if (!token) {
    return res
      .status(404)
      .send({ auth: false, token: null, message: "Missing token" });
  }
  //sinon je verifie le token
  jwt.verify(token, process.env.TOKEN_SECRET, (error, jwtDecoded) => {
    //si verification echoue : erreur 401, token invalide
    if (error) {
      console.log({token,error})
      return res
        .status(401)
        .send({ auth: false, token: null, message: "Not autorized" });
    }
    //sinon on ajoute le token à la requete pour la passer au controlleur suivant
    req.userToken = jwtDecoded;
  });
  next();
}

module.exports = verifyToken;
