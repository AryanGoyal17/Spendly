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

//3-- Pre-Save hook (This fn runs before saving user to database--)

userSchema.pre('save', async function(next) { // Run the async function before saving to database
    
    if(!this.isModified('password')) return next(); // If password is not modified, save without hashing...

    const salt = await bcrypt.genSalt(10); // 10 = high complexity level (slower but safer)

    this.password = await bcrypt.hash(this.password, salt); // replacing plane password with hashed password
    
    
});
    

    userSchema.methods.matchPassword = async function(enteredPassword) { //Comparing entered password with stored hashed password
        return await bcrypt.compare(enteredPassword, this.password);
    };

    const User = mongoose.model('User', userSchema); // Creating the user model. 
    module.exports = User; // Making the model usable in other files .. 


//The code which i have written above in User.js ensures that passwords are secretly hashed before saving in database and it 
//also provides a method to verify passwords during login.. 