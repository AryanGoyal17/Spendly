//1-- Importing the dependencies which we will need later in the project..

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose'); 
require('dotenv').config(); //Loading hidden variables from .env file

//2-- Initializing the express application 

const app = express(); //App represnts the server which handles and manages routes and middleware and 
                       //connects requests to controllers

//3-- Setting up middleware..

//A-- Allowing frontend to make requests to backend(enabling frontend-backend communication)

app.use(cors());

//B-- Setting up express.json
// express.json is a middleware that converts incoming JSON to javascript object and stores it in req.body

app.use(express.json());

//4-- Storing mongoDB connection string in dbURI

const dbURI = process.env.MONGO_URI;

//5-- Connecting to database

mongoose.connect(dbURI)
      
       .then(() => {
        console.log(`Successfully connected to MongoDB Atlas!!`);
       })

       .catch((error) => {
        console.error(`Error connecting to MongoDB Atlas`, error.message);
       })


//6-- Creating a test route --

app.get('/ping', (req, res) => {
    res.json({"message" : "Server running perfectly!"}) //(req, res) is the controller function..
});

//7-- Defining the port--

const PORT = 5000;

//8-- Starting the server and asking it to listen to the requests coming from PORT 5000

app.listen(PORT, () => {
    console.log(`Server is up and running on port ${PORT}!!`);
});

//NOTE-- Tried connecting to database, facing querySrv ECONNREFUSED error
