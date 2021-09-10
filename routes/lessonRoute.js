const express = require("express");
const router = express.Router();
const sql = require("../db/index");

router.get("/:user_id", async (req, res) => {
  try {
    const userLessons = await sql`
        select * from lessons where teacher = ${req.params.user_id} or student = ${req.params.user_id}
    `;

    if (userLessons.length <= 0) {
      res.send("You have no lessons planned");
    } else {
      res.send(userLessons);
    }
  } catch (error) {
    console.log(error);
    res.send(error);
  }
});

module.exports = router;
