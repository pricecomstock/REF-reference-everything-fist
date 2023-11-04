<script lang="ts">
	import NumberBlock from '$components/NumberBlock.svelte';
	import type { PageServerData } from '../traits/$types';
	export let data: PageServerData;
	$: ({ traits } = data);
</script>

<h1>Traits Index</h1>
{#each traits as trait}
	<div>
		<NumberBlock {trait} />
	</div>
{/each}

<style>
	div {
		margin: 1.5rem auto;
	}
</style>
