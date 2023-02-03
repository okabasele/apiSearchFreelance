const errorHandler = (err, req, res, next) => {
  //renvoyer un objet en reponse un objet
  res.status(err.statusCode ||500).send({
    success: false,
    status: err.statusCode ||500,
    message: err.message || "Something went wrong",
    stack: process.env.NODE_ENV,
  });
};

module.exports = errorHandler;
