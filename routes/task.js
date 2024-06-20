// routes/task.js
const express = require("express");
var router = express.Router();
const Task = require("../models/task");
const User = require("../models/user");

// Get all tasks
router.get("/:date/:userId", (req, res) => {

  // Nous allons chercher dans la base de donnée grâce 
  // à la date de création de la Task
  const date = new Date(req.params.date);
  const startOfDay = new Date(date.setHours(0, 0, 0, 0));
  const endOfDay = new Date(date.setHours(23, 59, 59, 999));

  // On vérifie dans un premier temps que l'utilisateur existe bien dans la base de donnée
  // Nous allons avoir besoin de l'USER suans la reche des bonnes Tasks
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        res.json({ result: false, message: "User not found" });
        return;
      }

      // $gte = Greater than
      // $lt = less than
      Task.find({
        user_Id: req.params.userId,
        created_at: { $gte: startOfDay, $lt: endOfDay },
      })
        .then((data) => {
          // si le Tableau en retour est vide c'est qu'il n'y a pas de Task déjà enregistré
          if (data.length === 0) {
            res.json({ result: false });
            return;
          }

          // dans les données reçu on renvoie le tableau des tasks qui est un sous document dans un Document TASK
          res.json({ result: true, data: data[0].taskList });
        })
        .catch((error) => {
          console.error("Error fetching Tasks:", error);
          res.json({ result: false, error: "An error occurred" });
        });
    })
    .catch((error) => {
      console.error("Error fetching user:", error);
      res.json({ result: false, error: "An error occurred" });
    });
});

// Add a new task
router.post("/", function (req, res) {
  const date = new Date(req.body.created_at);
  const startOfDay = new Date(date.setHours(0, 0, 0, 0));
  const endOfDay = new Date(date.setHours(23, 59, 59, 999));

  User.findById(req.body.user_Id).then((user) => {
    if (!user) {
      res.json({ result: false, message: "User not found" });
      return;
    }
  });

  Task.findOne({
    user_Id: req.body.user_Id,
    created_at: { $gte: startOfDay, $lt: endOfDay },
  }).then((data) => {
    // Si il n'y a pas de task dans notre sous document, créer la liste de tasks
    if (!data) {
      const newTask = new Task({
        taskList: req.body.taskList,
        created_at: new Date(req.body.created_at),
        user_Id: req.body.user_Id,
      });
      newTask
        .save()
        .then((task) => {
          res.json(task.taskList);
        })
        .catch((err) => res.json({ message: err.message }));
    } else {
      // sinon on vien l'ajouter à la liste déjà existante
      data.taskList.push(req.body.taskList);

      data.save().then((task) => {
        // on retourne la derniere task ajouté
        res.json({ task: task.taskList[task.taskList.length - 1] });
      });
    }
  });
});

// Delete a new task
router.delete("/remove/:user_id/:task_id", function (req, res) {
  User.findById(req.params.user_id).then((user) => {
    if (!user) {
      res.json({ result: false, message: "User not found" });
      return;
    }
  });
  Task.updateOne(
    { user_Id: req.params.user_id, "taskList._id": req.params.task_id },
    { $pull: { taskList: { _id: req.params.task_id } } }
  ).then((data) => {
    res.json({ result: true });
  });
});

// Modify a task a new task
router.put("/put/:user_id/:task_id", function (req, res) {
  User.findById(req.params.user_id).then((user) => {
    if (!user) {
      res.json({ result: false, message: "User not found" });
      return;
    }
  });
  // si dans req.Body on reçoit un "completed" on ne va modifier que la partie completed 
  if (req.body.completed !== undefined) {
    Task.updateOne(
      { user_Id: req.params.user_id, "taskList._id": req.params.task_id },
      { $set: { "taskList.$.completed": req.body.completed } }
    ).then((data) => {
      res.json({ result: true });
    });
  }
    // si dans req.Body on reçoit un "text" on ne va modifier que la partie text 

  if (req.body.text !== undefined) {
    Task.updateOne(
      { user_Id: req.params.user_id, "taskList._id": req.params.task_id },
      { $set: { "taskList.$.text": req.body.text } }
    ).then((data) => {
      res.json({ result: true });
    });
  }
});

// get search
router.get("/search", async (req, res) => {
  const { q: searchTerm, userId } = req.query;
  try {
    const results = await Task.find({
      user_Id: userId,
      "taskList.text": { $regex: searchTerm, $options: "i" },
    }).sort({ created_at: -1 });
   // Le sort() sert à classer les résultats reçu et le -1 sert à ordoné de maniere décroissante
    res.json({ result: true, data: results });
  } catch (error) {
    console.error("Error searching tasks:", error);
    res
      .status(500)
      .json({
        result: false,
        error: "An error occurred while searching tasks",
      });
  }
});
module.exports = router;
