<script lang="ts">
	import NumberBlock from '$components/NumberBlock.svelte';
	import { getRandomTrait, traits } from '$lib/traits';
	import { loadCommunityTraits } from '$lib/community';
	import type { Trait } from '$lib/traits';

	import IconButton from '$components/IconButton.svelte';

	let allowCommunity = false;
	let communityTraits: Trait[] = [];
	let isLoadingCommunity = false;

	let trait = getRandomTrait();

	async function toggleCommunity() {
		if (allowCommunity && communityTraits.length === 0) {
			isLoadingCommunity = true;
			communityTraits = await loadCommunityTraits();
			isLoadingCommunity = false;
		}
	}

	const reroll = () => {
		const pool = allowCommunity ? [...traits, ...communityTraits] : traits;
		trait = pool[Math.floor(Math.random() * pool.length)];
	};
</script>

<svelte:head>
	<title>FistREF - Random Role</title>
</svelte:head>

<div class="controls">
	<label class="toggle">
		<input type="checkbox" bind:checked={allowCommunity} on:change={toggleCommunity} disabled={isLoadingCommunity} />
		<span>Allow Community</span>
	</label>
	<IconButton label="REROLL" size={24} on:click={reroll} />
</div>
<h1>Trait #{trait.number}: {trait.name}</h1>
<NumberBlock {trait} />

<style>
	h1 {
		text-align: center;
		margin-bottom: 3rem;
	}
	.controls {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
		margin: 2rem auto;
	}
	.toggle {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		cursor: pointer;
		font-size: 1rem;
	}
	.toggle input[type='checkbox'] {
		cursor: pointer;
		width: 1.2rem;
		height: 1.2rem;
	}
</style>
