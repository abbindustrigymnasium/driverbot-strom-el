//this file controlles the connection to the MQTT broker aswell as publishing and subscribing to it
  import mqtt from 'mqtt';
  import {MQTT_USERNAME, MQTT_PASSWORD, MQTT_TOPIC} from '../components/credentials.js';
  //mqtt broker details
  message: String
  const brokerURL='ws://maqiatto.com:8883';
  //const port= 1883;
  const topic=MQTT_TOPIC
  //client options
  const options: mqtt.IClientOptions={
      clientId:'client_website',
      username: MQTT_USERNAME,
      password: MQTT_PASSWORD,
      clean: false,
  };
  //logging the message from the broker
  const client=mqtt.connect(brokerURL, options)
  const onMessage = (topic: any, message: string) => {
  console.log(message);
  console.log(message.toString());
  const msg = message.toString();
  const time = new Date().getTime();
};

 export function onSend(brokerURL: string, message: string) {
    console.log(message);
    client.publish(topic, message);
    onMessage(brokerURL, message);
  }

  //connect to the broker and subscribe to it
  client.on('connect', () => {
     console.log('Connected to MQTT broker');
    client.subscribe(topic, (err) => {
      if (!err) {
          console.log('Subscribed to:', topic);
      }
    });
  });
  
  
  client.on('message', (topic, message) => {
    console.log(`Received message on topic ${topic}: ${message.toString()}`);
  });
  
  //publish message
 export const publishMessage = () => {
    client.publish(topic, 'Hola!',{retain: true}, (err) => {
      if (!err) {
        console.log('Message published successfully');
      } else {
        console.error('Failed to publish message:', err);
      }
    });
  };

  setInterval(publishMessage, 5000);



  