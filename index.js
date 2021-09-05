const express = require("express");
const userRouter = require("./routes/userRoute");
const session = require("express-session");
const cors = require("cors");
const pg = require("pg");
const dbConfig = require("./db/dbConfig");
const pgSession = require("connect-pg-simple")(session);

const app = express();

//pgPool
const pgPool = new pg.Pool(dbConfig);

pgPool.connect().then(() => {
  console.log("connected to database");
});

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
    store: new pgSession({
      pool: pgPool,
      tablename: "session",
    }),
    cookie: { secure: false, expires: 60 * 60 * 24 },
  })
);

//routes
app.use("/user", userRouter);

app.get("/", (req, res) => {
  res.send("ehllo");
});

app.listen(8080, () => {
  console.log("server running on localhost:8080");
});
