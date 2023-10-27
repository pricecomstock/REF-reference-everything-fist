<script lang="ts">
	import NumberBlock from '$components/NumberBlock.svelte';
	import type { PageServerLoad } from '../traits/$types';
	export let data: PageServerLoad;
	$: ({ traits } = data);
</script>

<h1>Traits Index</h1>
{#each traits as trait}
	<NumberBlock {trait} />
{/each}

<style>
</style>
