const mongoose = require("mongoose");
const { Schema } = mongoose;

const changeSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, default: Date.now },
  },
  { _id: false, collection: "note" } 
);

const noteSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    user_id: { type: Schema.Types.ObjectId, ref: "user", required: true },
    changes: [changeSchema],
    status: { type: String, enum: ["visible", "hidden"], default: "visible" },
  },
  { collection: "note" }
);

const Note = mongoose.model("Note", noteSchema);

module.exports = Note;