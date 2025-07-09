import { useEffect, useRef, useState } from "react";

const Chatbox = ({ chatbotId }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [config, setConfig] = useState(null);
  const messagesEnd = useRef(null);

  const sessionId =
    localStorage.getItem(`chatbot_session_${chatbotId}`) ||
    (() => {
      const id = crypto.randomUUID();
      localStorage.setItem(`chatbot_session_${chatbotId}`, id);
      return id;
    })();

  useEffect(() => {
    fetch(`https://chatbot-rag-production-319e.up.railway.app/api/chatbots/${chatbotId}`)
      .then((res) => res.json())
      .then((data) => setConfig(data))
      .catch(() =>
        setConfig({
          name: "AI Assistant",
          greeting: "Hello! How can I help you?",
          suggestions: [
            "What do you offer?",
            "How do I get started?",
            "Contact support",
          ],
        })
      );
  }, [chatbotId]);

  useEffect(() => {
    if (config && config.greeting) {
      setMessages([{ from: "bot", text: config.greeting }]);
      setSuggestions(
        config.suggestions || [
          "What do you offer?",
          "How do I get started?",
          "Contact support",
        ]
      );
    }
  }, [config]);

  useEffect(() => {
    messagesEnd.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const addMessage = (from, text) => {
    setMessages((prev) => [...prev, { from, text }]);
  };

  const sendMessage = async (query) => {
    query = query.trim();
    if (!query) return;
    addMessage("user", query);
    setInput("");
    setTyping(true);
    setSuggestions([]);

    try {
      const res = await fetch(
        `https://chatbot-rag-production-319e.up.railway.app/api/chat/query`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query, chatbotId, sessionId }),
        }
      );
      const data = await res.json();
      setTyping(false);
      addMessage("bot", data.answer || "...");
      setSuggestions(data.suggestions || []);
    } catch {
      setTyping(false);
      addMessage("bot", "⚠️ Error connecting to server.");
    }
  };

  return (
    <div id="chatbot-box">
      <div id="chatbot-header">
        {config?.name || "AI Assistant"}
        <span onClick={() => window.parent.postMessage("close-chatbot", "*")}>
          ✖
        </span>
      </div>
      <div id="chatbot-messages">
        {messages.map((msg, i) => (
          <div key={i} className={`chat-msg ${msg.from}`}>
            <img
              className="avatar"
              src={
                msg.from === "bot"
                  ? config?.botAvatar ||
                    "https://cdn-icons-png.flaticon.com/512/4712/4712109.png"
                  : config?.userAvatar ||
                    "https://cdn-icons-png.flaticon.com/512/149/149071.png"
              }
              alt="avatar"
            />
            <div className="bubble">{msg.text}</div>
          </div>
        ))}
        {typing && (
          <div className="chat-msg bot">
            <img
              className="avatar"
              src={
                config?.botAvatar ||
                "https://cdn-icons-png.flaticon.com/512/4712/4712109.png"
              }
              alt="avatar"
            />
            <div className="bubble typing">Typing...</div>
          </div>
        )}
        <div ref={messagesEnd} />
      </div>
      {suggestions.length > 0 && (
        <div className="suggestion-bar">
          {suggestions.map((sug, i) => (
            <button key={i} onClick={() => sendMessage(sug)}>
              {sug}
            </button>
          ))}
        </div>
      )}
      <div id="chatbot-input">
        <input
          value={input}
          placeholder="Type a message..."
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
        />
        <button onClick={() => sendMessage(input)}>➤</button>
      </div>
    </div>
  );
};

export default Chatbox;
