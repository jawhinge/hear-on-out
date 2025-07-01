<script lang="ts">
	import WeatherGen from '$lib/generators/weather/WeatherGen.svelte';

	import type { PageProps } from './$types';

	const { data }: PageProps = $props();
	const currentWeather = data.weatherData.current;
	const currentAirQuality = data.airQualityData.current;


	$inspect(currentWeather)
	$inspect(currentAirQuality)
</script>


<div class="flex min-h-screen flex-col items-center justify-center">
	<WeatherGen {...currentWeather}></WeatherGen>
</div>

