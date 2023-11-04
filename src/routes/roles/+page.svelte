<script lang="ts">
	import NumberBlock from '$components/NumberBlock.svelte';
	import type { PageServerData } from './$types';
	export let data: PageServerData;
	$: ({ roles } = data);
</script>

<h1>Roles Index</h1>
{#each roles as role}
	<div>
		<NumberBlock {role} />
	</div>
{/each}

<style>
	div {
		margin: 1.5rem auto;
	}
</style>
