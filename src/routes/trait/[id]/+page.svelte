<script lang="ts">
	import type { PageServerData } from './$types';
	import NumberBlock from '$components/NumberBlock.svelte';
	export let data: PageServerData;
	$: ({ trait } = data);
</script>

<h1>Trait # {trait.number}: {trait.name}</h1>
<NumberBlock {trait} />

<!-- <pre>{JSON.stringify(data, null, 2)}</pre> -->

<style>
	h1 {
		text-align: center;
		margin-bottom: 3rem;
	}
</style>
