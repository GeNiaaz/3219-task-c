require("dotenv").config();

const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");

app.use(express.json());

// I stored all the data here
const secrets = [
  {
    user: "admin",
    secret: "If you can see this message, you have admin access",
  },
  {
    user: "james",
    secret: "If you can see this message, you are James.",
  },
  {
    user: "pam",
    secret: "If you see this, you are a COMMONER!",
  },
];

// Acts as my database of users
const dbUsers = [
  {
    username: "admin",
    password: "pw123",
  },
  {
    username: "james",
    password: "password",
  },
];

// Data endpoint
app.get("/secrets", authenticateToken, (req, res) => {
  let response = secrets.filter((secret) => secret.user === req.user.user);
  if (response.length == 0) {
    response = secrets.filter((secrets) => secrets.user === "pam");
  }
  //   response = secrets.filter((secrets) => secrets.user === "pam");
  res.json(response);
});

// Authentication endpoint
app.post("/login", (req, res) => {
  // authenticate here
  const tryUsername = req.headers.username;
  const tryPassword = req.headers.password;

  const username = req.headers.username;
  const user = { user: username };

  const token = jwt.sign(user, process.env.ACCES_TOKEN);
  res.json({ token: token });
});

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) {
    // NOT AUTHENTICATED
    return res.sendStatus(401);
  }
  jwt.verify(token, process.env.ACCES_TOKEN, (err, user) => {
    if (err) {
      // NOT AUTHORIZED
      console.log(err);
      return res.sendStatus(403);
    }

    // console.log(user);

    req.user = user;
    next();
  });
}

app.listen(3002);
