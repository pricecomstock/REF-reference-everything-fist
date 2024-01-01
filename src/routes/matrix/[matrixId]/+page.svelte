<script lang="ts">
	import { page } from '$app/stores';
	import IconButton from '$components/IconButton.svelte';
	import { randomChoice } from '$lib/randUtil';
	import type { PageServerData } from './$types';
	export let data: PageServerData;
	$: ({ standardMatrices } = data);
	$: matrixTables = standardMatrices[$page.params.matrixId];
</script>

{#each matrixTables as table}
	<div class="field">
		<div class="left">
			<div class="table-name">{table.Title}:</div>
			{randomChoice(Object.values(table.Values))}
		</div>

		<div class="right">
			<IconButton size={16} on:click={rerollRole} />
		</div>
	</div>
{/each}

<pre>{JSON.stringify(matrixTables, null, 2)}</pre>

<style>
	div.field {
		margin: 1rem 0;
		display: flex;
		justify-content: space-between;
		max-width: 30rem;
	}
	/* styles go here */
	.table-name {
		font-weight: bold;
	}
</style>
