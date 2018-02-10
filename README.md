# mqtt-middleware
A concept of MQTT middleware (client) that accepts all messages from MQTT broker, processes it and then forwards the response to other MQTT clients. Uses RabbitMQ as MQTT broker

## Steps
1) Install RabbitMQ server by reading instructions from here (https://www.rabbitmq.com/install-homebrew.html)
2) Start RabbitMQ server
	rabbitmq-server
