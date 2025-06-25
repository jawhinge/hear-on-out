<script lang="ts">
	import { Synth, Loop, type SynthOptions, getTransport } from 'tone';

	let { currentWeather } = $props();

	const synthOptions = {
		oscillator: {
			type: 'triangle'
		},
		envelope: {
			attack: 0.005,
			decay: 0.3,
			sustain: 0.1,
			release: 0.1
		}
	} as SynthOptions;

	// getTransport().scheduleRepeat((time) => {
	// 	// use the callback time to schedule events
	// 	osc.start(time).stop(time + 0.1);
	// }, '8n');
	// // transport must be started before it starts invoking events
	// Tone.Transport.start();

	function setupAndPlay() {
		getTransport().bpm.value = 60;
		const synth = new Synth(synthOptions).toDestination();
		const loop = new Loop((time) => {
			synth.triggerAttackRelease('C2', '8n');
		}, '8n').start(0);
		getTransport().stop();
	}

	setupAndPlay();
</script>

<div class="flex min-h-screen flex-col items-center justify-center">WEATHERGEN</div>
