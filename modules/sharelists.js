const express = require("express");
const db = require('./db.js');
const router = express.Router();
const protect = require('./auth');

// endpoints ----------------------------
router.get("/sharelists", async function(req, res, next) {

   /*  console.log(res.locals.username);
    console.log(res.locals.userid);     */
    
    try {
        let data = await db.getSharedToDoLists();
        res.status(200).json(data.rows).end();
    }
    catch (err) {
        next(err);
    }    
    
});


//slå av og på eksisterende liste

/*router.put("/todolists/share", protect, async function(req, res, next) {	

    let updata = req.body;
    let userid = res.locals.userid;    

    try {
        let data = await db.shareToDoList(updata.sharing, updata.id);

        if (data.rows.length > 0) {
            res.status(200).json({msg: "Listen ble delt"}).end();
        }
        else {
            throw "Listen ble ikke delt";
        }
    }
    catch(err){
        console.log(err)
        next(err);
    }
});*/
module.exports = router;