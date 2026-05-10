const express = require('express')
const jwt = require('jwtwebtoken')
const User = require('../models/User')


// NOTE -- async function = An async function allows JavaScript to wait for time-taking operations like database queries without blocking the whole server.

const protect = async(req, res, next) => {

    let token; 

    if(req.headers.authorization && req.headers.authorization.startswith('Bearer')){ // Token sent format -- understood.. 

        try{
           token = req.headers.authorization.split(' ')[1]

           const decoded = jwt.verify(token, process.env.JWT_SECRET);
        }
    }

}