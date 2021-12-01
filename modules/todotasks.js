const express = require("express");
const db = require('./db.js');
const router = express.Router();
const protect = require('./auth');

// endpoints ----------------------------
router.get("/todo/:listid", protect, async function(req, res, next) {
    
    /* console.log(res.locals.username);
    console.log(res.locals.userid); */
    
	
    try {
        let data = await db.getAllToDoTasks(req.params.listid, res.locals.userid);
        //console.log(data);
        res.status(200).json(data.rows).end();
    }
    catch (err) {
        next(err);
    }
    
});

router.post("/todo", protect, async function(req, res, next) {	

    let updata = req.body;
    let userid = res.locals.userid;    

    try {
        let data = await db.createToDoTask(updata.heading, updata.date, updata.description, userid, updata.listid);

        if (data.rows.length > 0) {
            res.status(200).json({msg: "Nytt gjøremål ble opprettet"}).end();
        }
        else {
            throw "Gjøremålet ble ikke opprettet";
        }
    }
    catch(err){
        console.log(err)
        next(err);
    }
});

router.put("/todo", protect, async function(req, res, next) {	

    let updata = req.body;
    /* let userid = res.locals.userid; */    

    try {
        let data = await db.editToDoTask(updata.heading, updata.date, updata.description, updata.id);

        if (data.rows.length > 0) {
            res.status(200).json({msg: "Gjøremålet ble endret"}).end();
        }
        else {
            throw "Gjøremålet ble ikke endret";
        }
    }
    catch(err){
        console.log(err)
        next(err);
    }
});


router.delete("/todo", protect, async function(req, res, next) {

    let updata = req.body;
    let userid = res.locals.userid;

    try {
        let data = await db.deleteToDoTask(updata.id, userid);

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