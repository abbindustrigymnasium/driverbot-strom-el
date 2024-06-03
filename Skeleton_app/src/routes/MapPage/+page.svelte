<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import mqtt from 'mqtt';
  import "../../components/credentials";
  import { onSend } from '../../stores/driveControll';
  import { MQTT_PASSWORD, MQTT_TOPIC, MQTT_USERNAME } from '../../components/credentials';

  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D | null = null;
  let startX = 150, startY = 150; // Adjusted initial starting position for the line
  let messageStartTime: number | null = null; // Track the start time of the current message

  // MQTT client optionsw
  const OPTIONS: mqtt.IClientOptions = {
    clientId: 'client_website_' + Math.random().toString(16).substr(2, 8), // Ensure unique client ID
    username: MQTT_USERNAME,
    password: MQTT_PASSWORD,
    clean: false,
  };

  const BROKER_URL = 'ws://maqiatto.com:8883';
  const client = mqtt.connect(BROKER_URL, OPTIONS);

  // Function to send a message to the MQTT broker
  function sendMessage(direction: string) {
    const message = JSON.stringify({ direction });
    onSend(message);
  }

  // Function to handle button activation based on button ID
  function handleButtonActivation(buttonId: string) {
    const button = document.getElementById(buttonId);
    if (button) {
      button.click();
    }
  }

  // Function to control buttons based on keyboard events
  function controlButtons(event: KeyboardEvent) {
    switch (event.key) {
      case 'w':
        handleButtonActivation('upButton');
        break;
      case 'a':
        handleButtonActivation('leftButton');
        break;
      case 's':
        handleButtonActivation('downButton');
        break;
      case 'd':
        handleButtonActivation('rightButton');
        break;
      case 'i':
        handleButtonActivation('stopButton');
        break;
      default:
        break;
    }
  }

  let prevDirection: string | null = null;

// Function to handle incoming MQTT messages
function handleMessage(topic: string, message: Buffer) {
  try {
    const parsedMessage = JSON.parse(message.toString());
    const direction = parsedMessage.direction;
    console.log(`Received message on topic ${topic}: ${direction}`);
    
    if (prevDirection !== direction) {
      // If the direction has changed, update prevDirection and draw the line
      prevDirection = direction;
      messageStartTime = performance.now(); // Set the start time of the current message
      drawDirection(direction);
    }
  } catch (error) {
    console.error('Failed to parse message:', message.toString(), error);
  }
}

  // Function to draw direction on the canvas
  function drawDirection(direction: string) {
    // Ensure ctx is not null
    if (!ctx) {
        console.error("Canvas context is not initialized.");
        return;
    }

    console.log("Drawing direction:", direction);

    let endX = startX;
    let endY = startY;

    const length = calculateLineLength(); // Calculate the length of the line based on message duration

    // Set stroke color and widthw
    ctx.strokeStyle = 'aqua';
    ctx.lineWidth = 2;

    switch (direction) {
        case 'up':
            endY -= length;
            break;
        case 'down':
            endY += length;
            break;
        case 'left':
            endX -= length;
            break;
        case 'right':
            endX += length;
            break;
        default:
            console.error('Unknown direction:', direction);
            return;
    }

    console.log("Drawing line from", startX, startY, "to", endX, endY);

    // Begin drawing
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.stroke();

    // Update the starting position for the next line segment
    startX = endX;
    startY = endY;
  }

  // Function to calculate line length based on message duration
  function calculateLineLength(): number {
    if (messageStartTime === null) return 0;
    const duration = performance.now() - messageStartTime;
    console.log(duration);

    return duration*60 ;
  }

  onMount(() => {
    document.addEventListener('keydown', controlButtons); // Add listener for keydown events

    ctx = canvas?.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas on mount
    }

    client.subscribe(MQTT_TOPIC);
    client.on('message', handleMessage);

    return () => {
      document.removeEventListener('keydown', controlButtons);
      client.unsubscribe(MQTT_TOPIC);
      client.end();
    };
  });

  onDestroy(() => {
    client.unsubscribe(MQTT_TOPIC);
    client.end();
  });
</script>

<div class="container h-full mx-auto flex justify-center items-center">
  <div class="space-y-2 text-center flex flex-col items-center">
    <h2 class="h2">Driving</h2>
    <figure>
      <section class="img-bg" />
      <svg class="fill-token -scale-x-[100%]" xmlns="http://www.w3.org/2000/svg" viewBox="100 100">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
          <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
          <g id="SVGRepo_iconCarrier">
            <path d="M3 8L5.72187 10.2682C5.90158 10.418 6.12811 10.5 6.36205 10.5H17.6379C17.8719 10.5 18.0984 10.418 18.2781 10.2682L21 8M6.5 14H6.51M17.5 14H17.51M8.16065 4.5H15.8394C16.5571 4.5 17.2198 4.88457 17.5758 5.50772L20.473 10.5777C20.8183 11.1821 21 11.8661 21 12.5623V18.5C21 19.0523 20.5523 19.5 20 19.5H19C18.4477 19.5 18 19.0523 18 18.5V17.5H6V18.5C6 19.0523 5.55228 19.5 5 19.5H4C3.44772 19.5 3 19.0523 3 18.5V12.5623C3 11.8661 3.18166 11.1821 3.52703 10.5777L6.42416 5.50772C6.78024 4.88457 7.44293 4.5 8.16065 4.5ZM7 14C7 14.2761 6.77614 14.5 6.5 14.5C6.22386 14.5 6 14.2761 6 14C6 13.7239 6.22386 13.5 6.5 13.5C6.77614 13.5 7 13.7239 7 14ZM18 14C18 14.2761 17.7761 14.5 17.5 14.5C17.2239 14.5 17 14.2761 17 14C17 13.7239 17.2239 13.5 17.5 13.5C17.7761 13.5 18 13.7239 18 14Z" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
          </g>
        </svg>
      </svg>
    </figure>
    <div class="absolute right-40 bottom-20">
      <button id="stopButton" class="btn variant-filled text-4xl" on:click={() => sendMessage('stop')}>
        stop
      </button>
    </div>
    <div class="flex justify-center gap-1">
      <button id="upButton" class="btn variant-filled text-xl" on:click={() => sendMessage('up')}>
        <span class="material-symbols-outlined rotate-0">
          arrow_upward
        </span>
      </button>
    </div>
    <div class="gap-1 flex justify-center w-full">
      <button id="leftButton" class="btn variant-filled text-2xl" on:click={() => sendMessage('left')}>
        <span class="material-symbols-outlined">
          arrow_left_alt
        </span>
      </button>
      <button id="downButton" class="btn variant-filled text-2xl" on:click={() => sendMessage('down')}>
        <span class="material-symbols-outlined">
          arrow_downward_alt
        </span>
      </button>
      <button id="rightButton" class="btn variant-filled text-2xl" on:click={() => sendMessage('right')}>
        <span class="material-symbols-outlined">
          arrow_right_alt
        </span>
      </button>
    </div>
  </div>
  <canvas bind:this={canvas} width="300" height="150"></canvas>

</div>

<style>
  
  .container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh; /* Adjust as needed */
  }

  canvas {
    fill: antiquewhite;
    stroke: aqua;
    border: 5px solid black;
    position: relative; /* Ensure the element is positioned */
  z-index: 9999; 
  }
</style>