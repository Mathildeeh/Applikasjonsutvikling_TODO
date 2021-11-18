const express = require('express');
const td = require('./td.js');
const authUtils = require("./auth_utils.js");
const router = express.Router();

//endpoints ----------------------------------

//user login----------------------------
router.post("/users/login", async function(req, res, next) {
    res.status(200).send("Hello from POST - /users/login").end();
});


//list all users------------------------
router.get("/users", async function(req, res, next) {

    try {
        let data = await td.getAllUsers();
        res.status(200).json(data.rows).end();
    }
    catch(err) {
        next(err);
    }
    
});


//create a new user----------------------
router.post("/users", async function(req, res, next) {

let credString = req.headers.authorization;
let cred = authUtils.decodeCred(credString);

if (cred.username == "" || cred.password == "") {
    res.status(401).json({error: "No username or password"}).end();
    return;
}

let hash = authUtils.createHash(cred.password);

try {
    let data = await td.createUser(cred.username, hash.value, hash.salt);
    
    if (data.rows.length > 0) {
        res.status(200).json({msg: "The user was created succefully"}).end();
    }
    else {
        throw "The user couldn't be created";
    }
}
catch(err) {
    next(err);
}
   
});
   
//Login--------------------------
router.post("/users/login", async function (req, res, next) {
    
    let credString = req.headers.authorization;
    let cred = authUtils.decodeCred(credString);

    if (cred.username == "" || cred.password == "") {
        res.status(401).json({error: "No username or password"}).end();
        return;
    }

    try {
        let data = await td.getUser(cred.username);

        if (data.rows.length > 0) {

            let userData = data.rows[0];

            let test = authUtils.verifyPassword(cred.password, userData.password, userData.salt);
            console.log(test);

            if (test != true) {
                res.status(403).json({error: "the user dosn't exist"}).end();
            }
            console.log(userData);
            let tok = authUtils.createToken(userData.username, userData.id);

            res.status(200).json ({
                msg: "The login was sucessfully",
                token: tok
            }).end();
        }
        else {
            throw "The huser couldn't be found";
        }
    }
    catch(err) {
        next(err);
    }
});


//delete a user--------------------------
router.delete("/users", async function(req, res, next) {
    res.status(200).send("Hello from DELETE - /users").end();
});

//--------------------------------------
module.exports = router;