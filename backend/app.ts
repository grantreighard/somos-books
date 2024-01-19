const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");
const dotenv = require("dotenv");
const jwt = require("express-jwt");
const cookieParser = require("cookie-parser");
const unless = require("express-unless");

dotenv.config();

const app = express();

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());

app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  })
);

app.use(function (req, res, next) {
  if (req.headers.host?.includes("localhost")) {
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  }

  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, X-CSRF-Token"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Expose-Headers", "Set-Cookie");
  next();
});

app.use(function (req, res, next) {
  jwt({
    secret: process.env.JSON_WEB_TOKEN_SECRET,
    getToken: () => req.cookies.token,
    algorithms: ["HS256"],
  }).unless({
    path: ["/api/users/login", "api/users/register"],
  });
  next();
});

const port = process.env.PORT ?? 4000; // add PORT from process.env for use on Heroku for instance

const connectToDatabase = async () => {
  const url = process.env.DB_URL || "";
  const dbName = "somos";
  const client = new MongoClient(url);

  try {
    await client.connect();
    const db = client.db(dbName);
    await db.command({ ping: 1 });
    console.log("Connected successfully to database.");

    require("./routes/books")(app, db, "/api/books");
    require("./routes/users")(app, db, "/api/users");
  } catch (err) {
    console.error(err);
  }
};

connectToDatabase();

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
