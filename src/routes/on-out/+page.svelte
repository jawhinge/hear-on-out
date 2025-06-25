<script lang="ts">
	import WeatherGen from '$lib/generators/weather/WeatherGen.svelte';

	import type { PageProps } from './$types';

	const { data }: PageProps = $props();
	const currentWeather = data.current;
</script>

<WeatherGen {currentWeather}></WeatherGen>
