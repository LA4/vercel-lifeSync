const mongoose = require("mongoose");

const booknoteSchema = new mongoose.Schema({
  created_at: {
    type: Date,
    required: true,
    default: new Date(),
  },
  user_Id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  notes: { type: String },
  mood: { type: Number },
});

const Booknote = mongoose.model("Booknote", booknoteSchema);

module.exports = Booknote;
