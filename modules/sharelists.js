const express = require("express");
const db = require("./db.js");
const router = express.Router();

router.get("/sharelists", async function (req, res, next) {
  try {
    let data = await db.getSharedToDoLists();
    res.status(200).json(data.rows).end();
  } catch (err) {
    next(err);
  }
});

module.exports = router;