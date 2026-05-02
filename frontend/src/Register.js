import React, { useState } from "react";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const API = "https://smart-task-app-br1u.onrender.com";

  const handleRegister = async () => {
    if (!email || !password) {
      alert("Please enter email & password");
      return;
    }

    console.log("Register clicked 🔥"); // DEBUG

    try {
      const res = await fetch(`${API}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      const data = await res.text();
      console.log("Response:", data);

      alert(data);
    } catch (err) {
      console.error(err);
      alert("Server not reachable ❌");
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
        <button onClick={handleRegister}>
          Register
        </button>
      </div>
    </div>
  );
}

export default Register;