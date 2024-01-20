const jwtoken = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { ObjectId } = require("mongodb");

module.exports = (app, db, baseUrl) => {
  const secret = process.env.JSON_WEB_TOKEN_SECRET;

  function generateToken(user) {
    const payload = {
      email: user.email,
    };

    const options = {
      expiresIn: "1h",
      jwtid: process.env.JWT_ID,
      subject: `${user._id}`,
    };

    return jwtoken.sign(payload, secret, options);
  }

  function protectedMiddleware(req, res, next) {
    // get authorization from request header
    const token = req.cookies.token;
    if (token) {
      // verify the token
      jwtoken.verify(token, secret, (err, decodedToken) => {
        if (err) {
          if (err.name === "TokenExpiredError") {
            db.collection("users")
              .findOne({ email: decodedToken?.email })
              .then(() => {
                const newToken = generateToken({
                  email: decodedToken.email,
                });

                res.cookie("token", newToken, {
                  httpOnly: true,
                  sameSite: true,
                  secure: true,
                });

                req.user = { email: decodedToken.email };

                next();
              })
              .catch(() => {
                res.status(401).send({ error: "You are not authorized" });
              });
          } else {
            // token is invalid
            res.status(401).json({ error: "Invalid token." });
          }
        } else {
          // token is valid
          // set request user to do things like find roles
          req.user = { email: decodedToken.email };

          next();
        }
      });
    } else {
      res
        .status(401)
        .json({ error: "No token provided. You are unauthorized!" });
    }
  }

  app.get(`${baseUrl}/jwt`, protectedMiddleware, (req, res) => {
    if (req.cookies.token !== null) {
      const token = req.cookies.token;
      const { email } = req.user;

      jwtoken.verify(token, secret, (err, decodedToken) => {
        if (err) {
          db.collection("users")
            .findOne({ email })
            .then((user) => {
              // if the user exists and the passwords from creds and database match
              if (user) {
                // generate token
                const token = generateToken({ email });
                // return the token as a cookie
                res.cookie("token", token, {
                  httpOnly: true,
                  sameSite: true,
                  secure: true,
                });
                // return token
                res.status(200).send({
                  email: user.email,
                  favoritesList: user.favoritesList || [],
                });
              } else {
                res
                  .status(401)
                  .send({ error: "Invalid username or password." });
              }
            })
            .catch((err) => {
              res.status(404).send({ error: "Could not find that user." });
            });
        } else {
          // token is valid
          // set request user to do things like find roles
          db.collection("users")
            .findOne({ email: decodedToken.email })
            .then((user) => {
              res.status(200).send({
                email: decodedToken.email,
                favoritesList: user?.favoritesList || [],
              });
            });
        }
      });
    } else {
      res.status(401).send({ error: "Unauthorized!" });
    }
  });

  // register
  app.post(`${baseUrl}/register`, async (req, res) => {
    // pull in credentials from request
    let { password, email } = req.body;
    // hash password from creds
    const hash = bcrypt.hashSync(password, 12);
    // set creds to hash
    password = hash;
    // insert the new credentials into the users database
    const existingUser = await db.collection("users").findOne({ email });

    if (!existingUser) {
      db.collection("users")
        .insertOne({
          password,
          email,
          favoritesList: [],
          createdAt: Date.now(),
          updatedAt: Date.now(),
        })
        .then((user) => {
          // query the database for the user that has the ID returned
          // generate token
          const token = generateToken({ email });
          // return the token as a cookie
          res.cookie("token", token, {
            httpOnly: true,
            sameSite: true,
            secure: true,
          });

          // return token
          res.status(200).send({
            email,
            favoritesList: [],
          });
        })
        .catch((err) => {
          res.status(500).send({ error: "Could not insert the user: " + err });
        });
    } else {
      res
        .status(500)
        .send({ error: "A user with that username already exists." });
    }
  });

  // log in
  app.post(`${baseUrl}/login`, (req, res) => {
    // pull in credentials from request
    const { email, password } = req.body;

    // query users database for match with creds username
    db.collection("users")
      .findOne({ email })
      .then((user) => {
        // if the user exists and the passwords from creds and database match
        if (user && bcrypt.compareSync(password, user.password)) {
          // generate token
          const token = generateToken({ email });
          // return the token as a cookie
          res.cookie("token", token, {
            httpOnly: true,
          });

          // return token
          res.status(200).send({
            email: user.email,
            favoritesList: user.favoritesList || [],
          });
        } else {
          res.status(401).send({ error: "Invalid username or password." });
        }
      })
      .catch((err) => {
        res.status(404).send({ error: "Could not find that user." });
      });
  });

  app.get(`${baseUrl}/logout`, (req, res) => {
    res.cookie("token", null);
    res.clearCookie("token");
    res.status(200).end();
  });
};
