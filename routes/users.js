const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

const users = [];

router.post("/", async (req, res) => {
  try {
    const salt = await bcrypt.genSalt();
    const hashPass = await bcrypt.hash(req.body.password, salt);
    console.log(salt);
    console.log(hashPass);
    const user = { name: req.body.userName, password: hashPass };

    users.push(user);
    res.status(201).send();
  } catch {}
});

router.post("/login", async (req, res) => {
  const user = users.find((user) => user.name === req.body.userName);
  if (user == null) {
    res.status(400).send("Cant find user");
  }
  try {
    if (await bcrypt.compare(req.body.password, user.password)) {
      res.send(`${user.name} Logged in`);
    } else {
      res.send(`wrong Password`);
    }
  } catch {
    res.status(500).send();
  }
});

module.exports = router;
