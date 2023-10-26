<script lang="ts">
	import type { PageLoad } from './$types';
	import NumberBlock from '$components/NumberBlock.svelte';
	export let data: PageLoad;
	$: ({ trait } = data);
</script>

<h2>Trait # {trait.number}: {trait.name}</h2>
<NumberBlock {trait} />

<!-- <pre>{JSON.stringify(data, null, 2)}</pre> -->

<style>
	h2 {
		text-align: center;
		margin-bottom: 3rem;
	}
</style>
