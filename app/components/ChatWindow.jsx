import React, { useState, useRef, useEffect } from "react";
import styles from "../../styles/ChatWindow.module.css";

const ChatWindow = ({ messages, onSend, myId }) => {
  const [input, setInput] = useState("");
  const [newCount, setNewCount] = useState(0);
  const messagesEndRef = useRef(null);
  const messagesBoxRef = useRef(null);
  const [atBottom, setAtBottom] = useState(true);
  const lastSeenMsgCount = useRef(messages.length);

  useEffect(() => {
    if (atBottom) {
      messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
      setNewCount(0);
      lastSeenMsgCount.current = messages.length;
    } else if (messages.length > lastSeenMsgCount.current) {
      setNewCount((c) => c + (messages.length - lastSeenMsgCount.current));
      lastSeenMsgCount.current = messages.length;
    }
  }, [messages, atBottom]);

  const handleScroll = () => {
    const el = messagesBoxRef.current;
    if (!el) return;
    const isBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 10;
    setAtBottom(isBottom);
    if (isBottom) {
      setNewCount(0);
      lastSeenMsgCount.current = messages.length;
    }
  };

  const handleSend = () => {
    if (input.trim()) {
      onSend(input);
      setInput("");
    }
  };

  return (
    <div className={styles.chatWindow}>
      <div
        className={styles.messages}
        ref={messagesBoxRef}
        onScroll={handleScroll}
      >
        {messages.map((msg, idx) => {
          const isMine = myId && String(msg.senderId) === String(myId);
          return (
            <div
              key={idx}
              className={`${styles.message} ${
                isMine ? styles.sent : styles.received
              }`}
            >
              <div>{msg.text}</div>
              <small>
                {isMine ? "You" : "Friend"} •{" "}
                {new Date(msg.timestamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </small>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>
      {newCount > 0 && !atBottom && (
        <div
          className={styles.newMessages}
          onClick={() => {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
          }}
        >
          {newCount} new message{newCount > 1 ? "s" : ""}
        </div>
      )}
      <div className={styles.inputArea}>
        <input
          type="text"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button onClick={handleSend}>
          <span>&uarr;</span>
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;