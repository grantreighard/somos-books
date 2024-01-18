import express from "express";
import cors from "cors";
import booksJson from "./data/books.json";

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

const port = process.env.PORT ?? 4000; // add PORT from process.env for use on Heroku for instance

app.get("/books", (req, res) => {
  res.status(200).send(booksJson);
});

app.get("/search-books/:query", (req, res) => {
  const { query } = req.params;
  const decodedQuery = query.replace("+", "");

  const filteredBooks = booksJson.filter((book) => {
    return (
      book.title.toLowerCase().includes(decodedQuery.toLowerCase()) ||
      book.authors.join(" ").toLowerCase().includes(decodedQuery.toLowerCase())
    );
  });

  res.status(200).send(filteredBooks);
});

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
