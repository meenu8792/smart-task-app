const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
  title: String,
  completed: {
    type: Boolean,
    default: false
  },
  dueDate: String,
  priority: {
    type: String,
    default: "Low"
  }
});

module.exports = mongoose.model("Task", TaskSchema);