import React, { useEffect, useState } from "react";
import api from "./api";
import { useNavigate } from "react-router-dom";

function Welcome() {
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWelcome = async () => {
      try {
        const res = await api.get("/welcome");
        setMsg(res.data.message);
      } catch (err) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    };
    fetchWelcome();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div>
      <h2>Welcome</h2>
      <p>{msg}</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default Welcome;
