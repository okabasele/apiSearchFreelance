const express = require('express');
const app = express();
const apiRouter = require('./routes');
const { port } = require('./utils/env')
const errorHandler = require("./middlewares/errorHandling");

app.use(express.json());
app.use('/api/v1', apiRouter);
app.use(errorHandler);

//CONNEXION A LA BDD
mongoose
  .connect(
    `${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_CLUSTER}.c81utqm.mongodb.net/?retryWrites=true&w=majority`
  )
  .then(() => {
    console.log("successfully connected to database");
  })
  .catch((err) => console.log(err));

//Démarrer le serveur sur un port d'écoute
app.listen(
    //PORT
    process.env.PORT,
    //CALLBACK APPELER AU LANCEMENT POUR VERIFIER QUE LE SERVEUR TOURNE
    () => {
        console.log('Serveur launch');
    }
);
