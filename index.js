const express = require("express");
const userRouter = require("./routes/userRoute");
const session = require("express-session");
const cors = require("cors");
const pg = require("pg");
const dbConfig = require("./db/dbConfig");
const pgSession = require("connect-pg-simple")(session);
const morgan = require("morgan");

const checkAuth = require("./middleware/checkAuth");

const app = express();

require("dotenv").config();

//pgPool
const pgPool = new pg.Pool(dbConfig);

pgPool.connect().then(() => {
  console.log("connected to database");
});

app.use(express.json());

//logger
app.use(morgan("dev"));

//cors
app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "DELETE"],
    credentials: true,
  })
);

//sessions
app.use(
  session({
    secret: process.env.SESSION_SECRET || "some secret",
    resave: false,
    saveUninitialized: false,
    store: new pgSession({
      pool: pgPool,
      tablename: "session",
    }),
    cookie: {
      secure: process.env.NODE_ENV === "production",
      expires: 60 * 60 * 24 * 1000,
    },
  })
);

//routes
app.use("/user", userRouter);

app.get("/", checkAuth, (req, res) => {
  res.json({
    isAuth: true,
    message: "wtf",
  });
});

app.listen(8080, () => {
  console.log("server running on localhost:8080");
});
