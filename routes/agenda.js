const express = require("express");
const router = express.Router();
const Agenda = require("../models/agenda");
const User = require("../models/user");

// POST new agenda
router.post("/", (req, res) => {
  const newEvent = new Agenda({
    event: req.body.event,
    user_Id: req.body.user_Id,
    start_at: req.body.start_at,
    end_at: req.body.end_at,
    time: req.body.time,
    title: req.body.title,
    updated_at: req.body.updated_at,
  });
  newEvent
    .save()
    .then((event) => {
      res.json({ result: true, newEvent: event });
    })
    .catch((error) => {
      res.json({ result: false, error });
    });
});

// GET search
router.get("/search", async (req, res) => {
  const { q: searchTerm, userId } = req.query;
  // $OR est un opérateur qui est équivalent à une condition  ( le || dans le if)
  try {
    const results = await Agenda.find({
      user_Id: userId,
      $or: [
        { title: { $regex: searchTerm, $options: "i" } },
        { event: { $regex: searchTerm, $options: "i" } },
      ],
    }).sort({ updated_at: -1 });
// Le sort() sert à classer les résultats reçu et le -1 sert à ordoné de maniere décroissante
    res.json({ result: true, data: results });
  } catch (error) {
    console.error("Error searching agendas:", error);
    res.json({
        result: false,
        error: "An error occurred while searching agendas",
      });
  }
});

// Get agenda
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
      Agenda.find({
        user_Id: req.params.userId,
        updated_at: { $gte: startOfDay, $lt: endOfDay },
      })
        .then((data) => {
          console.log("another data:", data);
          if (data.length === 0) {
            res.json({ result: false });
          } else {
            res.json({ result: true, data: data }); 
          }
        })
        .catch((error) => {
          console.error("Error fetching agenda:", error);
          res.json({ result: false, error: "An error occurred" });
        });
    })
    .catch((error) => {
      console.error("Error fetching user:", error);
      res.json({ result: false, error: "An error occurred" });
    });
});

module.exports = router;
