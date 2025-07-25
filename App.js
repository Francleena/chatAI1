import React, { useState } from "react";
import Login from "./Login";
import Chatbot from "./Chatbot";
import "./App.css";

function App() {
  const [name, setName] = useState("");
  return (
    <div className="main-bg">
      {name ? <Chatbot userName={name} /> : <Login onLogin={setName} />}
    </div>
  );
}

export default App;
