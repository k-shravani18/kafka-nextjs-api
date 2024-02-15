"use client";
import { useEffect, useState } from "react";

function WebSocketExample() {
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    // Check if we are in the browser environment before using browser-specific APIs
    if (process.browser) {
      // Your WebSocket logic here
      const ws = new WebSocket("ws://localhost:3000");

      // WebSocket message handler
      ws.onmessage = (event) => {
        const message = JSON.parse(event.data);
        setMessages((prevMessages) => [...prevMessages, message]);
      };

      // WebSocket close handler
      ws.onclose = () => {
        console.log("WebSocket connection closed");
      };

      // Clean up WebSocket connection on component unmount
      return () => {
        if(ws.readyState===1){
          ws.close();
        }
        
      };  
    }
  }, []);

  return (
    <div>
      <h1>Kafka Messages:</h1>
      <ul>
        {messages.map((message, index) => (
          <li key={index}>{message}</li>
        ))}
      </ul>
    </div>
  );
}

export default WebSocketExample;
