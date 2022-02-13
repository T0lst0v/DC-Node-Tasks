const bcrypt = require("bcrypt");
const express = require("express");
const app = express();
const router = express.Router();

const users = [];

router.post("/login", (req, res) => {
  const username = req.body.username;

  //check IF  session exists
  if (req.session) {
    req.session.username = username;
  }

  res.render("index");
});

router.get("/users", (req, res) => {
  res.json(users);
});

router.post("/user", (req, res) => {});

module.exports = router;
