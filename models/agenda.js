
const mongoose = require("mongoose");

const agendaSchema = new mongoose.Schema({
    event: { type: String },
    updated_at: { type: Date, default: Date.now },
    user_Id: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    start_at: { type: Date },
    end_at: { type: Date },
    time: { type: String },
    title: { type: String },
});

const Agenda = mongoose.model("Agenda", agendaSchema);

module.exports = Agenda;
