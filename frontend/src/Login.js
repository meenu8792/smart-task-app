import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const API = "https://smart-task-app-br1u.onrender.com";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

const handleLogin = async () => {
  try {
    setLoading(true);   // 🔥 START loading

    const res = await fetch(`${API}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();  // 🔥 updated

    if (data.message.includes("Successful")) {
      localStorage.setItem("user", email);
      navigate("/dashboard");
    } else {
      alert(data.message);
    }

  } catch (err) {
    alert("Server not reachable ❌");
  } finally {
    setLoading(false);   // 🔥 STOP loading
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

       <button onClick={handleLogin} disabled={loading}>
  {loading ? "Loading..." : "Login"}
</button>

        <p>
          New user? <a href="/register">Register</a>
        </p>
      </div>
    </div>
  );
}

export default Login;