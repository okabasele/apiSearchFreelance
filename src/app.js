require('dotenv').config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const apiRouter = require('./routes');
const errorHandler = require("./middlewares/errorHandling");
app.use(express.json());
app.use('/api/v1', apiRouter);
app.use(errorHandler);
const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'APISearchFreelance',
    description: 'Description',
  },
  host: 'localhost:3000',
  schemes: ['http'],
};


const outputFile = './swagger-output.json';
const endpointsFiles = ['./src/routes/index.js'];
swaggerAutogen(outputFile, endpointsFiles, doc);


const port = process.env.PORT;
const mongodb_user = process.env.MONGODB_USER;
const mongodb_password = process.env.MONGODB_PASSWORD;
const mongodb_cluster = process.env.MONGODB_CLUSTER;

//CONNEXION A LA BDD
mongoose.set('strictQuery', true);
mongoose
  .connect(
    `mongodb://${mongodb_user}:${mongodb_password}@${mongodb_cluster}/search-freelance?ssl=true&replicaSet=atlas-br7i0r-shard-0&authSource=admin&retryWrites=true&w=majority`
  )
  .then(() => {
    console.log("successfully connected to database");
  })
  .catch((err) => console.log(err));

//Démarrer le serveur sur un port d'écoute
app.listen(
  //PORT
  port,
  //CALLBACK APPELER AU LANCEMENT POUR VERIFIER QUE LE SERVEUR TOURNE
  () => {
    console.log("Serveur launch");
  }
);
