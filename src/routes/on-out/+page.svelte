<script lang="ts">
	import WeatherGen from '$lib/generators/weather/WeatherGen.svelte';

	import type { PageProps } from './$types';

	const { data }: PageProps = $props();
	const currentWeather = data.current;

	$inspect(currentWeather)
</script>


<div class="flex min-h-screen flex-col items-center justify-center">
	<WeatherGen {...currentWeather}></WeatherGen>
</div>

