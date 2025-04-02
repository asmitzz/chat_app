import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import { BASE_URL } from "../../constants";
import "./Chat.css";
import "../../index.css";

import { useParams } from "react-router-dom";
import { useApi } from "../../hooks/useApi";

const socket = io(BASE_URL);

const Chat = ({ user }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [typing, setTyping] = useState(false);
  const { data: history, get,loading } = useApi();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, history?.messages, messages]);

  const userId = user?.id;

  const params = useParams();

  useEffect(() => {
    if (params?.id) {
      setMessages([])
      fetchMessages();
    }

    socket.on("receive_message", (newMessage) => {
      if (
        newMessage.senderId?.toString() === params?.id?.toString() &&
        newMessage.receiverId?.toString() === userId?.toString()
      ) {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      }
    });

    socket.on("is_typing", (newMessage) => {
      if (newMessage.senderId?.toString() === params?.id?.toString()) {
        setTyping(true);
        setTimeout(() => {
          setTyping(false);
        }, 1000);
      }
    });

    return ()=>{
      socket.off("receive_message")
      socket.off("is_typing")
    }
  }, [params]);

  useEffect(() => {
    if (!userId) return;
    socket.emit("join", userId);
  }, [userId]);

  const fetchMessages = async () => {
    if (userId && params?.id) {
      await get(
        `${BASE_URL}/messages/history?senderId=${userId}&receiverId=${params?.id}`
      );
    }
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      const messageData = {
        senderId: userId,
        receiverId: params?.id,
        text: message,
      };

      socket.emit("send_message", messageData);
      setMessages((prevMessages) => [...prevMessages, messageData]);
      setMessage("");
    }
  };

  const handleOnChange = (e) => {
    setMessage(e.target.value);
    const messageData = {
      senderId: userId,
      receiverId: params?.id,
    };
    socket.emit("typing_indicator", messageData);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h2>Chat with {history?.user?.username}</h2>
      </div>
      <div className="messages">
        {loading && <div className="loader">
              <div className="spinner"></div>
            </div>}
        {[...(history?.messages || []), ...messages].map((msg, idx) => (
          <div
            key={idx}
            className={`message ${msg.senderId === user?.id ? "you" : "other"}`}
          >
            <p className="message-text">
              <strong>
                {msg.senderId === user?.id ? "You" : history?.user?.username} :{" "}
              </strong>
              {msg.text}
            </p>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      {typing && (
        <div className="typing_indicator">
          {history?.user?.username} is typing...
        </div>
      )}

      <div className="chat-input">
        <input
          type="text"
          value={message}
          onChange={handleOnChange}
          onKeyDown={handleKeyDown}
          placeholder="Type a message"
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chat;
