import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Login";
import "./App.css";
import Register from "./Register";
import Dashboard from "./Dashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;