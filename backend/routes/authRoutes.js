// This file maps API endpoints to the correct controller functions.

const express = require('express'); //Import express
const router = express.Router(); //Initialize a new router

const {signup, login} = require('../controllers/authController'); //Importing signup and login functions from authcontroller


//Defining the routes and cnnecting them to controller fn's
router.post('/signup', signup);
router.post('/login', login);

module.exports = router; //Exporting the router to make it usable in server.js