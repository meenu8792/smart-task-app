import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement
} from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement
);

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("Low");
  const [filter, setFilter] = useState("all");
  

  const fetchTasks = async () => {
    const res = await fetch("http://localhost:5000/tasks");
    const data = await res.json();
    setTasks(data);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const addTask = async () => {
    if (!title) return;

    await fetch("http://localhost:5000/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ title, priority })
    });

    setTitle("");
    fetchTasks();
  };

  const toggleTask = async (task) => {
    await fetch(`http://localhost:5000/tasks/${task._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: !task.completed })
    });
    fetchTasks();
  };

  const editTask = async (task) => {
    const updated = prompt("Edit task", task.title);
    if (!updated) return;

    await fetch(`http://localhost:5000/tasks/${task._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: updated })
    });

    fetchTasks();
  };

  const deleteTask = async (id) => {
    await fetch(`http://localhost:5000/tasks/${id}`, {
      method: "DELETE"
    });
    fetchTasks();
  };

  
  // ✅ FIXED CLEAR ALL
const clearAll = async () => {
  try {
    if (!window.confirm("Clear all tasks?")) return;

    await fetch("http://localhost:5000/tasks", {
      method: "DELETE"
    });

    setTasks([]);   // 🔥 instant UI clear
    await fetchTasks(); // 🔥 sync again

  } catch (err) {
    alert("Clear failed");
  }
};
  const filteredTasks = tasks.filter((task) => {
    if (filter === "active") return !task.completed;
    if (filter === "completed") return task.completed;
    return true;
  });

  // PIE DATA
  const completed = tasks.filter(t => t.completed).length;
  const pending = tasks.length - completed;

  const pieData = {
    labels: ["Completed", "Pending"],
    datasets: [{
      data: [completed, pending],
      backgroundColor: ["#00c853", "#ff1744"]
    }]
  };
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>🚀 Smart Task Dashboard</h1>

      {/* INPUT */}
      <div style={styles.inputBox}>
        <input
          style={styles.input}
          placeholder="Enter task"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <select
          style={styles.select}
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        >
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>

        <button style={styles.addBtn} onClick={addTask}>
          Add
        </button>
      </div>

      {/* FILTER */}
      <div style={styles.filters}>
        <button onClick={() => setFilter("all")}>All</button>
        <button onClick={() => setFilter("active")}>Active</button>
        <button onClick={() => setFilter("completed")}>Completed</button>
        <button onClick={clearAll}>Clear All</button>
      </div>

      {/* TASK GRID */}
      <div style={styles.grid}>
        {filteredTasks.map(task => (
<div
  key={task._id}
  style={{
    ...styles.taskCard,
    backgroundColor:
      task.priority === "High"
        ? "#ffcccc"
        : task.priority === "Medium"
        ? "#ffe5b4"
        : "#cce5ff"
  }}
>            <h3 style={{
              textDecoration: task.completed ? "line-through" : "none"
            }}>
              {task.title}
            </h3>

            <p>{task.priority}</p>

            <button onClick={() => toggleTask(task)}>
              {task.completed ? "Undo" : "Complete"}
            </button>

            <button onClick={() => editTask(task)}>Edit</button>

            <button onClick={() => deleteTask(task._id)}>Delete</button>
          </div>
        ))}
      </div>

      {/* 📊 GRAPHS AT BOTTOM */}
      <div style={{ width: "300px", margin: "40px auto" }}>
        <Pie data={pieData} />
      </div>
    
      </div>
    
  );
}

export default Dashboard;

/* 🎨 UI */
const styles = {
  container: {
  minHeight: "100vh",
  textAlign: "center",
  padding: "20px",
  background: "#f4f7fb"  // 🔥 LIGHT clean background
},
  title: {
    marginBottom: "20px"
  },
  inputBox: {
    display: "flex",
    justifyContent: "center",
    gap: "10px",
    marginBottom: "20px"
  },
  input: {
    padding: "10px",
    borderRadius: "5px",
    border: "none"
  },
  select: {
    padding: "10px",
    borderRadius: "5px"
  },
  addBtn: {
    background: "green",
    color: "white",
    padding: "10px 20px",
    border: "none",
    borderRadius: "5px"
  },
  filters: {
    display: "flex",
    justifyContent: "center",
    gap: "10px",
    marginBottom: "20px"
  },
  grid: {
    display: "flex",
    flexWrap: "wrap",
    gap: "15px",
    justifyContent: "center"
  },
  card: {
    width: "250px",
    background:"white", 
    color: "black",
    padding: "15px",
    borderRadius: "10px",
   
  }
};