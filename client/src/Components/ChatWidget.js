import React, { useState } from "react";

const ChatWidget = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "bot", text: "Hi! 🌾 Ask me anything about crops or farming!" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
  if (!input.trim()) return;
  const userMsg = { role: "user", text: input };
  setMessages((prev) => [...prev, userMsg]);
  const currentInput = input;
  setInput("");
  setLoading(true);

  try {
    console.log("Sending to backend:", currentInput); // 👈 check this prints

    const res = await fetch("https://prithviphal-backend.onrender.com/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: currentInput }),
    });

    console.log("Response status:", res.status); // 👈 check status code

    const data = await res.json();
    console.log("Full response data:", data); // 👈 see exactly what comes back

    const replyText = data.reply || data.error || "No reply field found";
    setMessages((prev) => [...prev, { role: "bot", text: replyText }]);
  } catch (err) {
    console.error("Fetch error:", err); // 👈 check for CORS or network errors
    setMessages((prev) => [...prev, { role: "bot", text: "Error: " + err.message }]);
  }
  setLoading(false);
};

  return (
    <div style={{ position: "fixed", bottom: "24px", right: "24px", zIndex: 1000 }}>
      {/* Toggle Button */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          background: "#4CAF50", color: "white", border: "none",
          borderRadius: "50%", width: "56px", height: "56px",
          fontSize: "24px", cursor: "pointer", boxShadow: "0 4px 12px rgba(0,0,0,0.2)"
        }}
      >
        🌾
      </button>

      {/* Chat Box */}
      {open && (
        <div style={{
          position: "absolute", bottom: "70px", right: "0",
          width: "320px", background: "white", borderRadius: "12px",
          boxShadow: "0 8px 24px rgba(0,0,0,0.15)", overflow: "hidden"
        }}>
          {/* Header */}
          <div style={{ background: "#4CAF50", color: "white", padding: "12px 16px", fontWeight: "bold" }}>
            🌱 Crop Assistant
          </div>

          {/* Messages */}
          <div style={{ height: "280px", overflowY: "auto", padding: "12px", display: "flex", flexDirection: "column", gap: "8px" }}>
            {messages.map((msg, i) => (
              <div key={i} style={{
                alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
                background: msg.role === "user" ? "#4CAF50" : "#f1f1f1",
                color: msg.role === "user" ? "white" : "#333",
                padding: "8px 12px", borderRadius: "12px", maxWidth: "80%", fontSize: "14px"
              }}>
                {msg.text}
              </div>
            ))}
            {loading && <div style={{ alignSelf: "flex-start", color: "#999", fontSize: "13px" }}>Typing...</div>}
          </div>

          {/* Input */}
          <div style={{ display: "flex", borderTop: "1px solid #eee" }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Ask about crops..."
              style={{ flex: 1, padding: "10px 12px", border: "none", outline: "none", fontSize: "14px" }}
            />
            <button
              onClick={sendMessage}
              style={{ background: "#4CAF50", color: "white", border: "none", padding: "10px 14px", cursor: "pointer" }}
            >
              ➤
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWidget;