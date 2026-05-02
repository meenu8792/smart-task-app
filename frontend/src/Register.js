import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
const navigate = useNavigate();
 const [loading, setLoading] = useState(false);
  const API = "https://smart-task-app-br1u.onrender.com";

  const handleRegister = async () => {
  if (!email || !password) {
    alert("Please enter email & password");
    return;
  }

  try {
    setLoading(true);   // 🔥 START loading

    const res = await fetch(`${API}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();   // 🔥 use json

    alert(data.message);

  } catch (err) {
    alert("Server not reachable ❌");
  } finally {
    setLoading(false);   // 🔥 STOP loading
  }
};

  return (
    <div className="container">
      <div className="card">
        <h2>Register</h2>

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* ✅ IMPORTANT FIX */}
       <button onClick={handleRegister} disabled={loading}>
  {loading ? "Registering..." : "Register"}
</button>
      </div>
    </div>
  );
}

export default Register;