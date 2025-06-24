<script lang="ts">
	import { goto } from '$app/navigation';
	import Geolocation from 'svelte-geolocation';
	import type { GeolocationError } from 'svelte-geolocation/Geolocation.svelte';

	let getPosition: boolean = $state(false);
	let loading: boolean = $state(false);
	let position: GeolocationPosition | undefined = $state(undefined);
	let error: GeolocationError | undefined = $state(undefined);

	function flipGetPosition(): void {
		getPosition = true;
	}

	function goToPlayer(): void {
		goto(`/on-out?lat=${position?.coords.latitude}&long=${position?.coords.longitude}`);
	}
</script>

{#if !getPosition}
	<button onclick={flipGetPosition}> Find yourself </button>
{:else if loading}
	<p>Loading...</p>
{:else if error}
	<p>We can't seem to find you.</p>
{:else}
	<p>Your Position is set as: {position?.coords?.latitude}, {position?.coords?.longitude}</p>
	<button onclick={goToPlayer}>Ok, on-out with it</button>
{/if}

<Geolocation {getPosition} bind:position bind:loading bind:error />
