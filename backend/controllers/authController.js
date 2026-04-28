//1--

const User = require('../models/User') // Importing the User model so that backend can communicate with database 
const jwt = require('jsonwebtoken') // Importing the jwt package

//2-- Generating the jwt token..

//NOTE: Used crypto(Node's built in security library) to generate the JWT_SECRET key and stored it in .env

const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: '30d', //Token expires in 30days, User has to login again after 30 days.. 
    });
};

