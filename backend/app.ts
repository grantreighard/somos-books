import express from "express";
import cors from "cors";
import { MongoClient } from "mongodb";

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

const port = process.env.PORT ?? 4000; // add PORT from process.env for use on Heroku for instance

const connectToDatabase = async () => {
  const url = process.env.DB_URL || "";
  const dbName = "mostcard";
  const client = new MongoClient(url);

  try {
    await client.connect();
    const db = client.db(dbName);
    await db.command({ ping: 1 });
    console.log("Connected successfully to database.");

    require("./routes/users")(app, db, "/api/users");
    require("./routes/books")(app, db, "/api/books");
  } catch (err) {
    console.error(err);
  }
};

connectToDatabase();

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
