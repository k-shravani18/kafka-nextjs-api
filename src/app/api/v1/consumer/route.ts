import { NextRequest, NextResponse } from "next/server";
import ConsumerFactory, { ExampleMessageProcessor } from "./ConsumerFactory";
import WebSocket from "ws";
// import {Server as WebSocketServer} from "ws";

const messageProcessor: ExampleMessageProcessor = { a: "" };
// Maintain a list of WebSocket connections
const connections: WebSocket[] = [];

export async function GET(req: NextRequest, res: NextResponse) {
  // Create a new consumer instance
  let consumer = new ConsumerFactory(messageProcessor);
  let messages: any[] = [];
  try {
    // Start the Kafka consumer
    await consumer.startConsumer();
    console.log("Consumer started successfully");

    // Create a WebSocket server
    const wss = new WebSocket.Server({ port: 3000 });

    // Handle WebSocket connection
    wss.on("connection", (ws: WebSocket) => {
      connections.push(ws);

      // Handle WebSocket close event
      ws.on("close", () => {
        const index = connections.indexOf(ws);
        if (index !== -1) {
          connections.splice(index, 1);
        }
      });
    });

    // Kafka message handler
    const kafkaMessageHandler = (message: string) => {
      // Push Kafka message to connected WebSocket clients
      connections.forEach((ws) => {
        ws.send(message);
      });
    };

    // Wait for a few seconds to receive messages
    await new Promise((resolve) => setTimeout(resolve, 5000));

    // Stop the consumer
    await consumer.shutdown();

    // Return success response
    return NextResponse.json({
      message: "Messages received from Kafka topic",
      payloads: messages,
    });
  } catch (error) {
    console.error("Failed to receive Kafka messages:", error);
    return NextResponse.json({
      message: "Failed to receive Kafka messages",
      payloads: "error occurred",
    });
  }
}
