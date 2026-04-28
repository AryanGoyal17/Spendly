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


// @desc Register a new user(signup)
// @route POST /api/auth/signup

const signup = async(req, res) => {
    try{
        const{name, email, password, monthlyBudget} = req.body;

        //Checking if user already exists!

        const UserExists = await User.findOne({email});

        if(UserExists) {
            return res.status(400).json({message: 'User already exists'});
        }

        //If user doesnt exist, adding user in the database.. 

        const user = await User.create({
            name,
            email,
            password,
            monthlyBudget: monthlyBudget || 0 //Monthly budget defaults to 0, if user doesnt provide one.. 
        });

        
    }
}
