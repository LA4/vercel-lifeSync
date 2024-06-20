const mongoose = require("mongoose");
const UserSchema = mongoose.Schema({
  username: {
    type: String,
    require: true,
    validate: {
      validator: function (v) {
        let re = /[.*+?^${}()|[\]\\]/g;
        return !re.test(v);
      },
      message: "Not valid Username",
    },
  },
  email: {
    type: String,
    require: true,
    validate: {
      validator: function (v) {
        let re = /^\w+([.-]?\w+)@\w+([.-]?\w+)(.\w{2,3})+$/;
        if (v.match(re)) {
          return true;
        } else {
          return false;
        }
      },
      message: "Email not valid",
    },
  },
  password: {
    type: String,
    require: true,
    minLength: 8,
  },
  flameCount: Number,
  created_At: Date,
  moodGeneral: Number,
  note: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "booknotes",
      required: true,
    },
  ],
  task: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "tasks",
      required: true,
    },
  ],
  event: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "event",
      required: true,
    },
  ],
  token: String,
});
const User = mongoose.model("user", UserSchema);
module.exports = User;
