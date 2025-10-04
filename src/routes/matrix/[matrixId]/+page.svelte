<script lang="ts">
	import { page } from '$app/stores';
	import IconButton from '$components/IconButton.svelte';
	import { randomChoice } from '$lib/randUtil';
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import { UnfoldVertical } from 'lucide-svelte';
	import { afterNavigate, onNavigate } from '$app/navigation';
	export let data: PageData;

	$: ({ standardMatrices } = data);
	$: matrixTables = standardMatrices[$page.params.matrixId];

	let choices: [string, string][];
	let isExpanded: boolean[];

	function rerollAll() {
		choices = matrixTables.map((table) => randomChoice(Object.entries(table.Values)));
		isExpanded = matrixTables.map(() => false);
	}

	onMount(() => {
		rerollAll();
	});

	afterNavigate(() => {
		rerollAll();
	});

	function reroll(index: number) {
		const currentChoiceNumber = choices[index][0];
		while (choices[index][0] === currentChoiceNumber) {
			choices[index] = randomChoice(Object.entries(matrixTables[index].Values));
		}
		isExpanded[index] = false;
	}

	function toggleExpanded(index: number) {
		isExpanded[index] = !isExpanded[index];
	}

	function selectFromExpand(tableIndex: number, rollNumber: string) {
		choices[tableIndex] = [rollNumber, matrixTables[tableIndex].Values[rollNumber]];
		toggleExpanded(tableIndex);
	}
</script>

<h2>
	{$page.params.matrixId.toUpperCase()}
</h2>
<IconButton
	size={24}
	label="Reroll All"
	on:click={() => {
		rerollAll();
	}}
/>

{#each matrixTables as table, tableIndex}
	<div class="field">
		<div class="left">
			<div class="table-name">{table.Title} ({table.Roll}):</div>
			<div class="table-choice">
				<b>{choices?.[tableIndex][0]}:</b>
				{choices?.[tableIndex][1]}
			</div>
			{#if isExpanded?.[tableIndex]}
				<div class="result-list">
					{#each Object.entries(table.Values) as [number, result]}
						<button
							class:selected={number === choices[tableIndex][0]}
							on:keypress={() => selectFromExpand(tableIndex, number)}
							on:click={() => selectFromExpand(tableIndex, number)}
						>
							<b>{number}: </b>
							<span>{result}</span>
						</button>
					{/each}
				</div>{/if}
		</div>

		<div class="right">
			<IconButton
				icon={UnfoldVertical}
				size={16}
				on:click={() => {
					toggleExpanded(tableIndex);
				}}
			/>
			<IconButton
				size={16}
				on:click={() => {
					reroll(tableIndex);
				}}
			/>
		</div>
	</div>
{/each}

<style>
	h2 {
		text-align: left;
	}
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

	div.result-list {
		margin: 0;
		padding: 0;

		list-style: none;
	}

	button {
		background-color: var(--background);
		border: 1px solid var(--gray);
		display: block;

		border-radius: 0.3rem;
		cursor: pointer;
		transition: 0.1s;
	}

	button:hover {
		background-color: var(--text);
		color: var(--background);
	}

	.table-choice {
		margin-bottom: 0.5rem;
	}

	.selected {
		margin: 1rem 1rem;

		& span {
			font-weight: bold;
		}
	}
</style>
