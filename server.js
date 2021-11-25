//const db = require('./modules/db.js');
const express = require("express");
const server = express();
const PORT = process.env.PORT || 8080;
server.set("port", PORT);

const todotasks = require("./modules/todotasks.js");
const users = require("./modules/users.js");

// middleware ---------------------------
server.use(express.static("public"));
server.use(express.json());

server.use(todotasks);
server.use(users);

//general error handling ---------------
server.use(function (err, req, res, next){
    res.status(500).json({
        error: "Noe gikk galt på serveren",
        descr: err
    }).end();
});


// start server ------------------------
server.listen(server.get("port"), function () {
	console.log("server running", server.get("port"));
});

