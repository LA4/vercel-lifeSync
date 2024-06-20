var express = require("express");
var router = express.Router();
const bookNote = require("../models/booknote");
const User = require("../models/user");

/* GET home page. */
router.post("/", (req, res) => {
  const date = new Date(req.body.created_at);
  const startOfDay = new Date(date.setHours(0, 0, 0, 0));
  const endOfDay = new Date(date.setHours(23, 59, 59, 999));
  User.findById(req.body.user_Id).then((user) => {
    if (!user) {
      res.json({ result: false, message: "User not found" });
      return;
    }
  });
  bookNote
    .find({
      user_Id: req.body.userId,
      created_at: { $gte: startOfDay, $lt: endOfDay },
    })
    .then((data) => {
      console.log(data);
      if (data.length === 0) {
        const newNote = new bookNote({
          created_at: req.body.created_at,
          user_Id: req.body.user_Id,
          notes: req.body.note,
          mood: req.body.mood,
        });
        newNote.save().then((newNote) => {
          res.json({ result: true, newNote: newNote });
        });
      } else {
        bookNote
          .updateOne(
            {
              user_Id: req.body.user_Id,
              created_at: { $gte: startOfDay, $lt: endOfDay },
            },
            { $set: { notes: req.body.note } }
          )
          .then((data) => {});
      }
    });
});

// Mood
router.get("/mood/query/:user_Id", (req, res) => {
  console.log(req.params.user_Id);
  User.findById(req.params.user_Id).then((user) => {
    if (!user) {
      res.json({ result: false, message: "User not found" });
      return;
    }
  });
  bookNote
    .find({
      user_Id: req.params.user_Id,
    })
    .then((data) => {
      res.json({ result: true, data: data });
    });
});

router.put("/mood", (req, res) => {
  const date = new Date();
  const startOfDay = new Date(date.setHours(0, 0, 0, 0));
  const endOfDay = new Date(date.setHours(23, 59, 59, 999));

  bookNote
    .find({
      created_at: { $gte: startOfDay, $lt: endOfDay },
    })
    .then((data) => {
      if (data.length === 0) {
        res.json({ result: false });
        return;
      } else {
        bookNote
          .updateOne(
            { created_at: { $gte: startOfDay, $lt: endOfDay } },
            { mood: req.body.mood }
          )
          .then();
      }
      res.json({ result: true, data: data });
    });
});

router.get("/allNote", (req, res) => {
  bookNote.find().then((data) => {
    res.json({ result: data });
  });
});

router.get("/:date/:userId", (req, res) => {
  const date = new Date(req.params.date);
  const startOfDay = new Date(date.setHours(0, 0, 0, 0));
  const endOfDay = new Date(date.setHours(23, 59, 59, 999));

  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        res.json({ result: false, message: "User not found" });
        return;
      }
      bookNote
        .find({
          user_Id: req.params.userId,
          created_at: { $gte: startOfDay, $lt: endOfDay },
        })
        .then((data) => {
          if (data.length === 0) {
            res.json({ result: false });
            return;
          }
          // retourne le dernier element trouvé dans les notes à la date donné
          res.json({ result: true, data: data[data.length - 1] });
        })
        .catch((error) => {
          console.error("Error fetching bookNotes:", error);
          res.json({ result: false, error: "An error occurred" });
        });
    })
    .catch((error) => {
      console.error("Error fetching user:", error);
      res.json({ result: false, error: "An error occurred" });
    });
});
router.get("/search", async (req, res) => {
  const searchTerm = req.query.q;
  const userId = req.query.userId;
  try {
    const results = await bookNote
      .find({
        user_Id: userId,
        notes: { $regex: searchTerm, $options: "i" },
      })
      .sort({ created_at: -1 }); 
      // Le sort() sert à classer les résultats reçu et le -1 sert à ordoné de maniere décroissante
    res.json({ result: true, data: results });
  } catch (error) {
    console.error("Error searching notes:", error);
    res.json({
      result: false,
      error: "An error occurred while searching notes",
    });
  }
});

module.exports = router;
