const express = require("express");
const router = express.Router();
const sql = require("../db/index");

//bcrypt
const bcrypt = require("bcrypt");
const saltRounds = 10;

//register
router.post("/register", async (req, res) => {
  //destructure request body
  const { username, password, email, first, last } = req.body;

  //hashing password -> password from req.body + saltrounds defined earlier
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  // new user object
  const user = {
    username,
    password: hashedPassword,
    email,
    first_name: first,
    last_name: last,
  };
  // sql query to insert new user object which returns all if successful
  try {
    const newUser = await sql`
      insert into users ${sql(
        user,
        "username",
        "password",
        "email",
        "first_name",
        "last_name"
      )} returning *`;
    // if the new user is sucessfully inserted, this will create a session to keep track of who has logged in
    if (newUser) {
      req.session.user = {
        id: newUser[0].id,
        username: newUser[0].username,
        email: newUser[0].email,
        first: newUser[0].first_name,
        last: newUser[0].last_name,
      };

      res.status(200).json({ isAuth: true, session: req.session.user });
    }
    // error handling to find if username was taken or email
  } catch (error) {
    if (error.detail.includes("user")) {
      console.log(error);
      return res.status(424).send(error);
    } else if (error.detail.includes("email")) {
      console.log(error);
      return res.status(424).send(error);
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
        req.session.user = {
          id: user[0].id,
          username: user[0].username,
          email: user[0].email,
          first: user[0].first_name,
          last: user[0].last_name,
        };

        res.status(200).json({ isAuth: true, session: req.session.user });
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
      session: req.session.user,
    });
  } else {
    res.status(404).json({
      isAuth: false,
      message: "Unauthorized",
    });
  }
});

module.exports = router;
