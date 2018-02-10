import { createConnection, AMQPClient, QueueCallback, AMQPQueue, SubscribeCallback } from "amqp";

interface SendMessageEnvelope {
    toQueue: string;
    payload: {
        code: number,
        message?: string,
        data?: any,
        fromQueue?: string
    };
}

export class Client {

    private middlewareQueue: string = 'gateway-incoming-messages';
    private myQueue: string = 'asrock_1234'
    private amqpClient: AMQPClient = null;

    constructor() {
        console.log('registering to MQTT broker');
        this.amqpClient = createConnection({ url: 'amqp://localhost' });

        this.amqpClient.on('error', (error) => {
            // console.log('error: ' + error);
        });

        this.amqpClient.on('ready', () => {
            console.log('connected to MQTT broker');
            this.listenIncomingMessages();
            this.sendMessage({
                toQueue: this.middlewareQueue,
                payload: {
                    code: 1,
                    data: {
                        message: 'Say Hello'
                    }
                }
            });
        });
    }

    private listenIncomingMessages() {
        console.log('starting listener');
        let amqpQueue: AMQPQueue = this.amqpClient.queue(this.myQueue);
        amqpQueue.subscribe(message => {
            console.log('message received');
            console.log(message);
        });
    }

    private sendMessage(envelope: SendMessageEnvelope) {
        console.log('sending message');
        envelope.payload.fromQueue = this.myQueue;
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