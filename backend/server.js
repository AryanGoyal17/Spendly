//1-- Importing the dependencies which we will need later in the project..

const express = require('express');
const cors = require('cors');

//2-- Initializing the express application 

const app = express(); //App represnts the server which handles and manages routes and middleware and 
                       //connects requests to controllers


//3-- Setting up middleware..

//A-- Allowing frontend to make requests to backend(enabling frontend-backend communication)

app.use(cors());

//B-- Setting up express.json
// express.json is a middleware that converts incoming JSON to javascript object and stores it in req.body

app.use(express.json());

//4-- Creating a test route --

app.get('/ping', (req, res) => {
    res.json({"message" : "Server running perfectly!"}) //(req, res) is the controller function..
});

//5-- Defining the port--

const PORT = 5000;

//6-- Starting the server and asking it to listen to the requests coming from PORT 5000

app.listen(PORT, () => {
    console.log(`Server is up and running on port ${PORT}!!`);
});
