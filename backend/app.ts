import express from "express";
import booksJson from "./data/books.json";

const app = express();

const port = process.env.PORT ?? 4000; // add PORT from process.env for use on Heroku for instance

app.get("/books", (req, res) => {
  res.status(200).send(booksJson);
});

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
