<script lang="ts">
	import NumberBlock from '$components/NumberBlock.svelte';
	import type { PageServerLoad } from './$types';
	export let data: PageServerLoad;
	$: ({ traits, roles } = data);
</script>

<h2>Traits</h2>
{#each traits as trait}
	<NumberBlock {trait} />
{/each}

<style>
</style>
