var express = require("express");
var router = express.Router();
const User = require("../models/user");

const uid2 = require("uid2");
const bcrypt = require("bcrypt");

router.post("/signUp", function (req, res) {
  // On vérifie que les chanmps sont complétés
  for (const field of ["email", "password", "username"]) {
    if (!req.body[field] || req.body[field] === "") {
      res.json({ result: false, error: "Missing or empty fields" });
      return;
    }
  }

  User.findOne({ email: req.body.email.toLowerCase() }).then((data) => {
    if (data === null) {
      const hash = bcrypt.hashSync(req.body.password, 10);

      const newUser = new User({
        username: req.body.username,
        email: req.body.email.toLowerCase(),
        password: hash,
        createdAt: new Date(),
        flameCount: 0,
        moodGeneral: 0,
        token: uid2(32),
      });

      newUser.save().then((newUser) => {
        res.json({ result: true, newUser: newUser });
      });
    } else {
      res.json({ result: false, error: "This account already exists" });
    }
  });
});

// POST users
router.post("/signIn", function (req, res) {
  for (const field of ["email", "password"]) {
    if (!req.body[field] || req.body[field] === "") {
      res.json({ result: false, error: "Missing or empty fields" });
      return;
    }
  }
  User.findOne({ email: req.body.email }).then((data) => {
    if (data && bcrypt.compareSync(req.body.password, data.password)) {
      let safeData = {
        userId: data._id,
        username: data.username,
        email: data.email,
        token: data.token,
        flameCount: data.flameCount,
      };
      res.json({ result: true, data: safeData });
    } else {
      res.json({ result: false, error: "User not found or wrong password" });
    }
  });
});

// POST delete
router.delete("/deletedAccount/:user_Id", (req, res) => {
  const userId = req.params.user_Id;
  User.deleteOne({ _id: userId })
    .then((result) => {
      if (result.deletedCount > 0) {
        res.json({ result: true, text: "Account deleted" });
      } else {
        res.status(404).json({ error: "User not found. Please try again." });
      }
    })
    .catch((err) => {
      console.error(err);
      res.json({ error: "An error occurred. Please try again later." });
    });
});

module.exports = router;
