// Cette page n'a pas servie et n'est pas appelée dans le code final de l'appli

var express = require("express");
const Booknote = require("../models/booknote");
var router = express.Router();

router.get("/:term", (req, res) => {
  const term = req.params.term;
  Booknote.find({ text: { $regex: term, $options: "i" } }).then((data) => {
    console.log(data);
  });

  res.json({ result: false });
});
module.exports = router;
