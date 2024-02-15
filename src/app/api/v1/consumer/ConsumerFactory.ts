import {
  Consumer,
  ConsumerSubscribeTopics,
  EachBatchPayload,
  Kafka,
  EachMessagePayload,
  LogEntry
} from "kafkajs";

export interface ExampleMessageProcessor {
  a: string;
}

export default class ConsumerFactory {
  private kafkaConsumer: Consumer;
  private messageProcessor: ExampleMessageProcessor;

  public constructor(messageProcessor: ExampleMessageProcessor) {
    this.messageProcessor = messageProcessor;
    this.kafkaConsumer = this.createKafkaConsumer();
  }

  public async startConsumer(): Promise<void> {
    
    const topic: ConsumerSubscribeTopics = {
      topics: ["create"],
      fromBeginning: true,
    };

    try {
      await this.kafkaConsumer.connect();
      await this.kafkaConsumer.subscribe(topic);

      await this.kafkaConsumer.run({
        eachMessage: async (messagePayload: EachMessagePayload) => {
          const { message } = messagePayload;
          if (message && message.value !== null) {
            const messageValue = message.value.toString(); // Convert message value to string
            console.log("Received message:", messageValue);
            // const prefix = `${topic}[${partition} | ${message.offset}] / ${message.timestamp}`;
            // console.log(`- ${prefix} ${message.key}#${message.value}`);
          }
        },
      });
    } catch (error) {
      console.log("Error: ", error);
    }
  }

  public async startBatchConsumer(): Promise<void> {
    const topic: ConsumerSubscribeTopics = {
      topics: ["create"],
      fromBeginning: true,
    };

    try {
      await this.kafkaConsumer.connect();
      await this.kafkaConsumer.subscribe(topic);
      await this.kafkaConsumer.run({
        eachBatch: async (eachBatchPayload: EachBatchPayload) => {
          const { batch } = eachBatchPayload;
          for (const message of batch.messages) {
            const prefix = `${batch.topic}[${batch.partition} | ${message.offset}] / ${message.timestamp}`;
            console.log(`- ${prefix} ${message.key}#${message.value}`);
          }
        },
      });
    } catch (error) {
      console.log("Error: ", error);
    }
  }

  public async shutdown(): Promise<void> {
    await this.kafkaConsumer.disconnect();
  }

  private createKafkaConsumer(): Consumer {
    const kafka = new Kafka({
      clientId: "create",
      brokers: ["localhost:9092"],
    });
    const consumer = kafka.consumer({ groupId: "consumer-group" });
    return consumer;
  }
}
