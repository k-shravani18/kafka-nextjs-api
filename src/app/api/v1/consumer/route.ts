// route.ts
import { NextRequest, NextResponse } from "next/server";
import ConsumerFactory, { ExampleMessageProcessor } from "./ConsumerFactory";

const messageProcessor: ExampleMessageProcessor = { a: "" };

export async function GET(req: NextRequest, res: NextResponse) {
  let consumer = new ConsumerFactory(messageProcessor);
  let messages: any[] = []; 

  try {
    await consumer.startConsumer();
    console.log("Consumer started successfully");

    // Wait for a few seconds to receive messages
    await new Promise((resolve) => setTimeout(resolve, 5000));

    // Stop the consumer
    await consumer.shutdown();

    // Return the messages in the response
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
