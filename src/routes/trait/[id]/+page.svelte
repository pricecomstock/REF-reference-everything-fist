<script lang="ts">
	import type { PageServerData } from './$types';
	import NumberBlock from '$components/NumberBlock.svelte';
	import { formatTraitRoleNumber } from '$lib/util';
	export let data: PageServerData;
	$: ({ trait } = data);
	$: isCommunity = 'author' in trait;
</script>

<h1>Trait # {formatTraitRoleNumber(trait.number, true, isCommunity)}: {trait.name}</h1>
<NumberBlock {trait} />

<!-- <pre>{JSON.stringify(data, null, 2)}</pre> -->

<style>
	h1 {
		text-align: center;
		margin-bottom: 3rem;
	}
</style>
