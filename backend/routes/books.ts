const booksJson = require("../data/books.json");

module.exports = (app, db, baseUrl) => {
  app.get(baseUrl, (req, res) => {
    res.status(200).send(booksJson);
  });

  app.get(`${baseUrl}/search/:query`, (req, res) => {
    const { query } = req.params;
    const decodedQuery = query.replace("+", "");

    const filteredBooks = booksJson.filter((book) => {
      return (
        book.title.toLowerCase().includes(decodedQuery.toLowerCase()) ||
        book.authors
          .join(" ")
          .toLowerCase()
          .includes(decodedQuery.toLowerCase())
      );
    });

    res.status(200).send(filteredBooks);
  });

  app.put(`${baseUrl}/set-favorites`, (req, res) => {
    const { favoritesList, email } = req.body;

    db.collection("users")
      .findOneAndUpdate({ email }, { $set: { favoritesList } })
      .then((response) => {
        res.status(200).send("successfully updated favorites");
      })
      .catch((err) => {
        res.status(500).send({ error: err });
      });
  });
};
