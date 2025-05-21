import React from "react";
import { useState } from "react";
import "./App.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Replace with your actual backend URL
const baseUrl =
  "https://c8b2a57c-2ab9-4fc3-bfae-9e47fc4749d0-00-3ouqva7v2nu95.sisko.replit.dev:3001";

const errorMessages = {
  INPUT_TOO_LONG: "Message exceeds 280 characters.",
  UNSUPPORTED_CONTROL_CHAR: "Input contains unsupported control characters.",
  UNKNOWN_SYMBOL: "Encoded text contains unknown symbols.",
  NETWORK_ERROR: "Server unreachable. Please try again.",
};

function App() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const handleAction = async (action) => {
    try {
      const res = await fetch(`${baseUrl}/api/${action}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          [action === "encode" ? "text" : "encoded"]: input,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw data;

      setOutput(action === "encode" ? data.encoded : data.text);
    } catch (err) {
      const code = err?.code || "NETWORK_ERROR";
      toast.error(errorMessages[code] || "Unexpected error occurred.");
    }
  };

  return (
    <div className="app">
      <h1>Symbol Cipher Tool</h1>

      <textarea
        rows="6"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter text here..."
      />

      <div className="button-group">
        <button onClick={() => handleAction("encode")}>Encode</button>
        <button onClick={() => handleAction("decode")}>Decode</button>
      </div>

      <textarea
        rows="6"
        value={output}
        readOnly
        placeholder="Output will appear here..."
      />

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default App;
