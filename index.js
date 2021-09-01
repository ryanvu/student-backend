const express = require("express");
const userRouter = require("./routes/userRoute");
const session = require("express-session");
const cors = require("cors");

const app = express();

//middleware
app.use(express.json());
//cors
app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST"],
    credentials: true,
  })
);
//sessions
app.use(
  session({
    secret: process.env.SESSION_SECRET || "some secret",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, expires: 60 * 60 * 24 },
  })
);

//routes
app.use("/user", userRouter);

app.listen(8080, () => {
  console.log("server running on localhost:8080");
});
