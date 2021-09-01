const express = require("express");
const router = express.Router();
const sql = require("../db/index");

//bcrypt
const bcrypt = require("bcrypt");
const saltRounds = 10;

//register
router.post("/register", async (req, res) => {
  //destructure request body
  const { username, password, email } = req.body;
  //hashing password -> password from req.body + saltrounds defined earlier
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  // new user object
  const user = {
    username,
    password: hashedPassword,
    email,
  };
  // sql query to insert new user object which returns all if successful
  try {
    const newUser = await sql`
      insert into users ${sql(
        user,
        "username",
        "password",
        "email"
      )} returning *`;
    // if the new user is sucessfully inserted, this will create a session to keep track of who has logged in
    if (newUser) {
      req.session.user = newUser[0];
      console.log("session", req.session);
      res.status(200).json({ session: req.session, user: newUser[0] });
    }
    // error handling to find if username was taken or email
  } catch (error) {
    if (error.detail.includes("user")) {
      return res.status(424).json({
        error: "Username already taken",
      });
    } else if (error.detail.includes("email")) {
      return res.status(424).json({
        error: "Email is already taken",
      });
    }
    return res.status(500).send("Unable to register");
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await sql`
    select * from users where username = ${username}`;
    if (user.length > 0) {
      const compared = await bcrypt.compare(password, user[0].password);

      if (compared) {
        req.session.user = user[0];
        console.log("session", req.session);
        res.status(200).json({ session: req.session });
      } else {
        res.status(403).send("Wrong password");
      }
    } else {
      res.status(403).send({
        message: "User does not exist",
      });
    }
  } catch (error) {
    console.log(error);
  }
});

router.delete("/logout", (req, res) => {
  if (req.session) {
    req.session.destroy((err) => {
      if (err) {
        res.status(400).send("Unable to log out");
      } else {
        res.send("Logout successful");
      }
    });
  } else {
    res.end();
  }
});

router.get("/isAuth", async (req, res) => {
  if (req.session.user) {
    res.json({
      isAuth: true,
      session: req.session,
    });
  } else {
    res.status(404).json({
      isAuth: false,
      message: "Unauthorized",
    });
  }
});

module.exports = router;
