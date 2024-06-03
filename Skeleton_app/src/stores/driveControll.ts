import mqtt from 'mqtt';
import { MQTT_USERNAME, MQTT_PASSWORD, MQTT_TOPIC } from '../components/credentials';
import { writable } from 'svelte/store';

const BROKER_URL = 'ws://maqiatto.com:8883';
const TOPIC = MQTT_TOPIC;

const OPTIONS: mqtt.IClientOptions = {
  clientId: 'client_website',
  username: MQTT_USERNAME,
  password: MQTT_PASSWORD,
  clean: false,
};

const client = mqtt.connect(BROKER_URL, OPTIONS);

export const onMessage = (topic: string, message: Buffer) => {
  const msg = message.toString();
  console.log(`Received message on topic ${topic}: ${msg}`);
  try {
    const data = JSON.parse(msg) as Position;
    if (data.latitude && data.longitude) {
      positions.update(posList => [...posList, data]);
    }
  } catch (e) {
    console.error('Failed to parse message:', e);
  }
};

export function onSend(message: string) {
  console.log(`Sending message: ${message}`);
  client.publish(TOPIC, message, err => {
    if (err) {
      console.log('Message failed to publish');
    }
  });
}

client.on('connect', () => {
  console.log('Connected to MQTT broker');
  client.subscribe(TOPIC, err => {
    if (!err) {
      console.log(`Subscribed to: ${TOPIC}`);
    }
  });
});

client.on('message', (topic, message) => {
  onMessage(topic, message);
});

interface Position {
  latitude: number;
  longitude: number;
  timestamp?: string;
}

export const positions = writable<Position[]>([]);
