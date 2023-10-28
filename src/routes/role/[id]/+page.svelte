<script lang="ts">
	import type { PageServerData } from './$types';
	import NumberBlock from '$components/NumberBlock.svelte';
	export let data: PageServerData;
	$: ({ role } = data);
</script>

<h1>Role # {role.number}: {role.name}</h1>
<NumberBlock {role} />

<!-- <pre>{JSON.stringify(data, null, 2)}</pre> -->

<style>
	h1 {
		text-align: center;
		margin-bottom: 3rem;
	}
</style>
