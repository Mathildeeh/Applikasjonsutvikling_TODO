const express = require("express");
const todo = require('./td.js');
const router = express.Router();

// endpoints ----------------------------
router.get("/todo", async function(req, res, next) {
	
    try {
        let data = await todo.getAllToDoTasks();
        res.status(200).json(data.rows).end();
    }
    catch (err) {
        next(err);
    }
    
});

router.post("/todo", async function(req, res, next) {	

    let updata = req.body;
    let userid = 1;

    try {
        let data = await todo.createToDoTask(updata.heading, updata.description, userid);

        if (data.rows.length > 0) {
            res.status(200).json({msg: "Nytt gjøremål ble opprettet"}).end();
        }
        else {
            throw "Gjøremålet ble ikke opprettet";
        }
    }
    catch(err){
        next(err);
    }
});

router.delete("/todo", async function(req, res, next) {

    let updata = req.body;

    try {
        let data = await todo.deleteToDoTask(updata.id);

        if (data.rows.length > 0) {
            res.status(200).json({msg: "Gjøremålet ble slettet"}).end();
        }
        else {
            throw "Gjøremålet kunne ikke slettes";
        }
    }
    catch(err){
        next(err);
    }
});

module.exports = router;