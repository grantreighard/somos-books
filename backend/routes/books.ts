const booksJson = require("../data/books.json");

module.exports = (app, db, baseUrl) => {
  app.get(baseUrl, (req, res) => {
    db.collection("books")
      .find({})
      .toArray()
      .then((response) => {
        res.status(200).send(response);
      })
      .catch((err) => {
        res.status(404).send({ error: err });
      });
  });

  app.get(`${baseUrl}/search/:query`, (req, res) => {
    const { query } = req.params;
    const decodedQuery = query.replace("+", "");

    db.collection("books")
      .find({
        $or: [
          { title: { $regex: new RegExp(decodedQuery, "i") } },
          {
            authors: { $elemMatch: { $regex: new RegExp(decodedQuery, "i") } },
          },
        ],
      })
      .toArray()
      .then((response) => {
        res.status(200).send(response);
      })
      .catch((err) => {
        res.status(404).send({ error: err });
      });
  });

  // used once to insert books into database
  app.post(`${baseUrl}/set`, (req, res) => {
    db.collection("books")
      .insertMany(booksJson)
      .then(() => {
        res.status(200).send("inserted books");
      })
      .catch((err) => {
        res.status(500).send({ error: err });
      });
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
