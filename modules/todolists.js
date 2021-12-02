const express = require("express");
const db = require('./db.js');
const router = express.Router();
const protect = require('./auth');

// endpoints ----------------------------
router.get("/todolists", protect, async function(req, res, next) {
    
    try {
        let data = await db.getAllToDoLists(res.locals.userid);
        res.status(200).json(data.rows).end();
    }
    catch (err) {
        next(err);
    }    
    
});

router.post("/todolists", protect, async function(req, res, next) {	

    let updata = req.body;
    let userid = res.locals.userid;

    try {
        let data = await db.createToDoList(updata.listname, userid, updata.share);

        if (data.rows.length > 0) {
            res.status(200).json({msg: "Ny liste ble opprettet"}).end();
        }
        else {
            throw "Listen ble ikke opprettet";
        }
    }
    catch(err){
        console.log(err)
        next(err);
    }
});

router.put("/todolists", protect, async function(req, res, next) {	

    let updata = req.body;
    let userid = res.locals.userid;    

    try {
        let data = await db.editToDoList(updata.listname, updata.share, updata.id);

        if (data.rows.length > 0) {
            res.status(200).json({msg: "Listenavnet ble endret"}).end();
        }
        else {
            throw "Listenavnet ble ikke endret";
        }
    }
    catch(err){
        console.log(err)
        next(err);
    }
});


router.delete("/todolists", protect, async function(req, res, next) {

    let updata = req.body;
    let userid = res.locals.userid;

    try {
        let data = await db.deleteToDoList(updata.id, userid);

        if (data.rows.length > 0) {
            res.status(200).json({msg: "Listen ble slettet"}).end();
        }
        else {
            throw "Listen kunne ikke slettes";
        }
    }
    catch(err){
        next(err);
    }
});

module.exports = router;