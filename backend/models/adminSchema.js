const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const AdminSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  }
}, {
  timestamps: true
});

module.exports = model("admin", AdminSchema);
