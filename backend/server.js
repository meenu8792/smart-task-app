require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");

const User = require("./models/user");
const Task = require("./models/Task");

const app = express();
const PORT = process.env.PORT || 5000;


// ✅ FINAL CORS FIX (VERY IMPORTANT)
app.use(cors({
  origin: [
    "https://smart-task-app-git-main-meenu8792s-projects.vercel.app",
    "https://smart-task-hkwg24878-meenu8792s-projects.vercel.app",
    "http://localhost:3000"
  ],
  credentials: true
}));
app.options('*', cors());

// ✅ JSON middleware
app.use(express.json());


// ✅ ROOT CHECK
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});


// ✅ DB CONNECTION
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected ✅"))
  .catch(err => console.log(err));


// =========================
// 🔐 REGISTER
// =========================
app.post("/register", async (req, res) => {
  try {
    console.log("REGISTER HIT:", req.body);

    const { email, password } = req.body;

    const exist = await User.findOne({ email });
    if (exist) return res.status(400).send("User already exists");

    const hash = await bcrypt.hash(password, 10);

    const user = new User({ email, password: hash });
    await user.save();

    res.send("User Registered Successfully ✅");
  } catch (err) {
    console.log(err);
    res.status(500).send("Register error");
  }
});


// =========================
// 🔐 LOGIN
// =========================
app.post("/login", async (req, res) => {
  console.log("LOGIN REQUEST RECEIVED 🔥");
  try {
    console.log("LOGIN HIT:", req.body);

    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).send("User not found ❌");

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).send("Wrong password ❌");

    res.send("Login Successful ✅");
  } catch (err) {
    console.log(err);
    res.status(500).send("Login error");
  }
});


// =========================
// 📌 TASK ROUTES
// =========================
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
  const updated = await Task.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(updated);
});

app.delete("/tasks/:id", async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.send("Deleted");
});

app.delete("/tasks", async (req, res) => {
  await Task.deleteMany({});
  res.json({ message: "All tasks deleted" });
});


// =========================
// 🚀 SERVER START
// =========================
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});