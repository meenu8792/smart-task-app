require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");

const User = require("./models/user");
const Task = require("./models/Task");
const PORT = process.env.PORT || 5000;

const app = express();
app.use(cors());
app.use(express.json());
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// DB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected ✅"))
  .catch(err => console.log(err));

// REGISTER
app.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    const exist = await User.findOne({ email });
    if (exist) return res.status(400).send("User already exists");

    const hash = await bcrypt.hash(password, 10);

    const user = new User({ email, password: hash });
    await user.save();

    res.send("User Registered Successfully ✅");
  } catch (err) {
    res.status(500).send("Register error");
  }
});

// LOGIN
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).send("User not found ❌");

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).send("Wrong password ❌");

  res.send("Login Successful ✅");
});

// TASK ROUTES
app.post("/tasks", async (req, res) => {
  const task = new Task({
    ...req.body,
    completed: false,
    createdAt: new Date()
  });

  await task.save();
  res.send("Task Added");
});

app.get("/tasks", async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
});

app.put("/tasks/:id", async (req, res) => {
  const updated = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

app.delete("/tasks/:id", async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.send("Deleted");
});

// ✅ FIXED CLEAR ALL
app.delete("/tasks", async (req, res) => {
  await Task.deleteMany({});
  res.json({ message: "All tasks deleted" });
});



app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});