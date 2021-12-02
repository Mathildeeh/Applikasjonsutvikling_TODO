const express = require("express");
const db = require("./db.js");
const authUtils = require("./auth_utils.js");
const router = express.Router();
const protect = require("./auth");

router.get("/users", async function (req, res, next) {
  try {
    let data = await db.getAllUsers();
    res.status(200).json(data.rows).end();
  } catch (err) {
    next(err);
  }
});

router.get("/username", async function (req, res, next) {
  userid = req.headers.userid;
  try {
    let data = await db.getUsername(userid);
    res.status(200).json(data.rows).end();
  } catch (err) {
    next(err);
  }
});

router.post("/users", async function (req, res, next) {
  let credString = req.headers.authorization;
  let cred = authUtils.decodeCred(credString);

  if (cred.username == "" || cred.password == "") {
    res.status(401).json({ error: "Ingen brukernavn eller passord" }).end();
    return;
  }

  let hash = authUtils.createHash(cred.password);

  try {
    let data = await db.createUser(cred.username, hash.value, hash.salt);

    if (data.rows.length > 0) {
      res.status(200).json({ msg: "Bruker ble oprettet" }).end();
    } else {
      throw "Brukeren ble ikke oppretttet";
    }
  } catch (err) {
    next(err);
  }
});

router.post("/users/login", async function (req, res, next) {
  let credString = req.headers.authorization;
  let cred = authUtils.decodeCred(credString);

  if (cred.username == "" || cred.password == "") {
    res.status(401).json({ error: "Ingen brukernavn eller passord" }).end();
    return;
  }

  try {
    let data = await db.getUser(cred.username);

    if (data.rows.length > 0) {
      let userData = data.rows[0];

      let test = authUtils.verifyPassword(
        cred.password,
        userData.password,
        userData.salt
      );
     
      if (test != true) {
        res.status(403).json({ error: "Brukeren eksisterer ikke" }).end();
      }
      
      let tok = authUtils.createToken(userData.username, userData.id);

      res.status(200).json({
          msg: "Påloggingen var vellykket",
          token: tok,
        })
        .end();
    } else {
      throw "Brukeren ble ikke funnet";
    }
  } catch (err) {
    next(err);
  }
});

router.delete("/users/delete", protect, async function (req, res, next) {
  let userId = res.locals.userid;

  try {
    let data = await db.deleteUser(userId);

    if (data.rows.length > 0) {
      res.status(200).json({ msg: "Brukeren ble slettet" }).end();
    } else {
      throw "Brukeren ble ikke slettet";
    }
  } catch (err) {
    next(err);
  }
});

router.put("/users/edit", protect, async function (req, res, next) {
  let updata = req.body;
  let userid = res.locals.userid;

  let newHashedPassword = authUtils.createHash(updata.password);

  try {
    let data = await db.editUser(
      updata.username,
      newHashedPassword.value,
      newHashedPassword.salt,
      userid
    );

    if (data.rows.length > 0) {
      res.status(200).json({ msg: "Konto ble endret" }).end();
    } else {
      throw "Konto ble ikke endret";
    }
  } catch (err) {
    console.log(err);
    next(err);
  }
});

module.exports = router;