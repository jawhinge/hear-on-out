<script lang="ts">
	import { goto } from '$app/navigation';
	import Geolocation from 'svelte-geolocation';
	import type { GeolocationError } from 'svelte-geolocation/Geolocation.svelte';

	let getPosition: boolean = $state(false);
	let loading: boolean = $state(false);
	let position: GeolocationPosition | undefined = $state(undefined);
	let error: GeolocationError | undefined = $state(undefined);

	let options = {
		enableHighAccuracy: true,
		timeout: 5000, // milliseconds
		maximumAge: 60 * 60 * 1000, // milliseconds
	};

	$inspect(error);

	function flipGetPosition(): void {
		getPosition = true;
	}

	function goToPlayer(): void {
		goto(`/on-out?lat=${position?.coords.latitude}&long=${position?.coords.longitude}`);
	}
</script>

<div class="flex min-h-screen flex-col items-center justify-center">
	{#if !getPosition}
		<button class="animate-pulse cursor-crosshair text-xl" onclick={flipGetPosition}>
			Let me show you...
		</button>
	{:else if loading}
		<p class="text-xl">Loading...</p>
	{:else if error}
		<p class="text-xl">We can't seem to find you.</p>
	{:else}
		<p class="mb-5 text-xl">
			Your Position is set as: {position?.coords?.latitude}, {position?.coords?.longitude}
		</p>
		<button class="animate-pulse cursor-crosshair text-lg" onclick={goToPlayer}
			>Ok, on-out with it</button
		>
	{/if}
</div>

<Geolocation {options} {getPosition} bind:position bind:loading bind:error />
