<script lang="ts">
import ".././/../components/credentials"
import { onSend } from '../../stores/driveControll';
import "../../stores/driveControll"
    import { onMount } from "svelte";

	//send messages to determine direction of car
	function sendMessage(direction: string) {
        const message = direction === 'up' ? 'up' :
                                        direction === 'down' ? 'down' :
                                        direction === 'right' ? 'right' :
                                        direction === 'left' ? 'left' :
										direction === 'stop' ? 'stop': '';

        // Publish the message to MQTT topic
        onSend("ws://maqiatto.com:8883", message)
		
    }
	//handles button being clicked 
	function handleButtonActivation(buttonId: string)
	{
		const button = document.getElementById(buttonId);
		if (button)//check if button exists and if  it is not null
		{
			button.click()
		}
	}
	//controll what different keys activates which button 
	function controlButtons(event:KeyboardEvent){
		switch (event.key){
			case 'w':
				//direction ='up';
				handleButtonActivation('upButton')
				break;
			case 'a':
				handleButtonActivation('leftButton')
				break;
			case 's':
				handleButtonActivation('downButton')
				break;
			case 'd':
				handleButtonActivation('rightButton')
				break;
			case 'i':
				handleButtonActivation('stopButton')
			default: 
			//do nothing when any other key than wasd is pressed
				break;
		}
}
onMount(() => {
	document.addEventListener('keydown', controlButtons);	//adds listener to buttons for keydowns	
})


</script>
<div class="container h-full mx-auto flex justify-center items-center">
	<div class="space-y-2 text-center flex flex-col items-center">

		<h2 class="h2">Driving</h2>
		<!-- Car logo -->
		<figure>
			<section class="img-bg" />
			<svg
			class="fill-token -scale-x-[100%]"
			xmlns="http://www.w3.org/2000/svg"
			viewBox="100 100"
		>
		<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M3 8L5.72187 10.2682C5.90158 10.418 6.12811 10.5 6.36205 10.5H17.6379C17.8719 10.5 18.0984 10.418 18.2781 10.2682L21 8M6.5 14H6.51M17.5 14H17.51M8.16065 4.5H15.8394C16.5571 4.5 17.2198 4.88457 17.5758 5.50772L20.473 10.5777C20.8183 11.1821 21 11.8661 21 12.5623V18.5C21 19.0523 20.5523 19.5 20 19.5H19C18.4477 19.5 18 19.0523 18 18.5V17.5H6V18.5C6 19.0523 5.55228 19.5 5 19.5H4C3.44772 19.5 3 19.0523 3 18.5V12.5623C3 11.8661 3.18166 11.1821 3.52703 10.5777L6.42416 5.50772C6.78024 4.88457 7.44293 4.5 8.16065 4.5ZM7 14C7 14.2761 6.77614 14.5 6.5 14.5C6.22386 14.5 6 14.2761 6 14C6 13.7239 6.22386 13.5 6.5 13.5C6.77614 13.5 7 13.7239 7 14ZM18 14C18 14.2761 17.7761 14.5 17.5 14.5C17.2239 14.5 17 14.2761 17 14C17 13.7239 17.2239 13.5 17.5 13.5C17.7761 13.5 18 13.7239 18 14Z" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
		</svg>		
		</figure>
		<div class="absolute right-40 bottom-20">
			<button id="stopButton" class="btn variant-filled text-4xl"  on:click={() => sendMessage('stop')}>
				stop 
			</button>		
		</div>
		<div class="flex justify-center gap-1">
			<button id="upButton" class="btn variant-filled text-xl"  on:click={() => sendMessage('up')}>
				<span class="material-symbols-outlined rotate-0">
					arrow_upward
					</span></button>

		<!-- top button-->
		</div>
        <!-- Middle Row of Buttons -->
        <div class="gap-1 flex justify-center  w-full">
			<button id="leftButton" class="btn variant-filled text-2xl" on:click={()  => sendMessage('left')}>
				<span class="material-symbols-outlined">
					arrow_left_alt
					</span>
			</button>
			<button id="downButton"class="btn variant-filled text-2xl" on:click={() => sendMessage('down')}>
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
</div>

<style lang="postcss">
	figure {
		@apply flex relative flex-col;
	}
	figure svg,
	.img-bg {
		@apply w-64 h-64; md:w-80; md:h-80;
	}
	.img-bg {
		@apply absolute z-[-1] rounded-full blur-[50px] transition-all;
		animation: pulse 5s cubic-bezier(0, 0, 0, 0.5) infinite,
			glow 5s linear infinite;
	}
	@keyframes glow {
		0% {
			@apply bg-primary-400/50;
		}
		33% {
			@apply bg-secondary-400/50;
		}
		66% {
			@apply bg-tertiary-400/50;
		}
		100% {
			@apply bg-primary-400/50;
		}
	}
	@keyframes pulse {
		50% {
			transform: scale(1.5);
		}
	}
</style>
