//1-- Importing the dependencies which i will use in User.js

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

//2-- Defining the userSchema(how the user will be shown in database and rules for data)

const userSchema = new mongoose.Schema({

    name: {
        type: String,
        required: [true, 'Please provide a name']
    },

    email: {
        type: String,
        required: [true, 'Please provide an email'],
        unique: true, //To prevent duplicate emails..
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, //This is the format which ensures that user enters a valid email..
                                                             //not something like abcgmail.com etc..
            'Please provide a valid e-mail address'
        ]
    },

    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: 6,
        select: false //This prevents accidental exposure of password..
    },

    monthlyBudget: {
        type: Number, 
        default: 0 //Set to 0(default), can be changed from settings page later..
    }
}, {timestamps: true}); //timestamps = true -- automatically adds createdAt and updatedAt dates.. 


