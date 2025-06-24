<script lang="ts">
	import { page } from '$app/state';

	const lat = $derived(page.url.searchParams.get('lat'));
	const long = $derived(page.url.searchParams.get('long'));

	$inspect(lat);
	$inspect(long);
</script>
