import { createConnection, AMQPClient, AMQPQueue } from "amqp";
import { RedisClient } from "redis";

interface SendMessageEnvelope {
    toQueue: string;
    payload: {
        code: number,
        message?: string,
        data?: any,
        fromQueue?: string
    };
}

export class Middleware {

    private myQueue: string = 'gateway-incoming-messages';

    private amqpClient: AMQPClient = null;
    // private redisClient: RedisClient = new RedisClient({host: 'localhost', port: 6379})

    constructor() {
        console.log('registering to MQTT broker');
        this.amqpClient = createConnection({ url: 'amqp://localhost' });

        this.amqpClient.on('error', (error) => {
            // console.log('error: ' + error);
        });

        this.amqpClient.on('ready', () => {
            console.log('connected to MQTT broker');
            this.listenIncomingMessages();
        });
    }

    private listenIncomingMessages() {
        console.log('starting listener');
        let amqpQueue: AMQPQueue = this.amqpClient.queue(this.myQueue);
        amqpQueue.subscribe(payload => {
            console.log('message received');
            console.log(payload);
            if (payload.fromQueue) {
                this.sendMessage({
                    toQueue: payload.fromQueue,
                    payload: {
                        code: 0,
                        message: 'Hey There'
                    }
                })
            }
        });
    }

    private sendMessage(envelope: SendMessageEnvelope) {
        console.log('sending message');
        this.amqpClient.publish(
            envelope.toQueue,
            envelope.payload,
            {},
            function(d) {
                console.log('callback: ' + d)
            }
        );
    }
}