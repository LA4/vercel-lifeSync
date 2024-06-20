// models/task.js
const mongoose = require("mongoose");
const taskListSchema = mongoose.Schema({
  text: { type: String, required: true },
  completed: { type: Boolean, default: false },
});
const taskSchema = mongoose.Schema({
  created_at: { type: Date, default: new Date() },
  taskList: [taskListSchema],
  user_Id: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
});

const Task = mongoose.model("Task", taskSchema);
module.exports = Task;
