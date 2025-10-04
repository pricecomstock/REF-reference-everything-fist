<script lang="ts">
	import type { PageServerData } from './$types';
	import NumberBlock from '$components/NumberBlock.svelte';
	import { formatTraitRoleNumber } from '$lib/util';
	export let data: PageServerData;
	$: ({ role } = data);
</script>

<!-- 
<svelte:head>
	<title>FistREF - {role.name}</title>
</svelte:head> -->

<h1>Role # {formatTraitRoleNumber(role.number)}: {role.name}</h1>
<NumberBlock {role} />

<!-- <pre>{JSON.stringify(data, null, 2)}</pre> -->

<style>
	h1 {
		text-align: center;
		margin-bottom: 3rem;
	}
</style>
