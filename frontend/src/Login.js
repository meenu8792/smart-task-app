import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const API = "https://smart-task-app-br1u.onrender.com";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await fetch(`${API}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      const data = await res.text();

      if (data.includes("Successful")) {
        navigate("/dashboard");
      } else {
        alert(data);
      }
    } catch {
      alert("Server not reachable ❌");
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2>Login</h2>

        <input
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={handleLogin}>Login</button>

        <p>
          New user? <a href="/register">Register</a>
        </p>
      </div>
    </div>
  );
}

export default Login;