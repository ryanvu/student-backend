const express = require("express");
const router = express.Router();
const sql = require("../db/index");

router.get("/:user_id", async (req, res) => {
  try {
    res.send(req.params.user_id);
  } catch (error) {
    console.log(error);
    res.send(error);
  }
});

module.exports = router;
