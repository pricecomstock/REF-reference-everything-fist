<script lang="ts">
	import NumberBlock from '$components/NumberBlock.svelte';
	import { getRandomTrait, traits } from '$lib/traits';
	import { communityTraits as communityTraitsStore, loadAllCommunityContent } from '$lib/community';
	import type { Trait } from '$lib/traits';

	import IconButton from '$components/IconButton.svelte';
	import { formatTraitRoleNumber } from '$lib/util';
	import clsx from 'clsx';

	let allowCommunity = false;
	let isLoadingCommunity = false;

	let trait = getRandomTrait();
	$: isCommunity = 'author' in trait;

	async function toggleCommunity() {
		if (allowCommunity && $communityTraitsStore.length === 0) {
			isLoadingCommunity = true;
			await loadAllCommunityContent();
			isLoadingCommunity = false;
		}
	}

	const reroll = () => {
		const pool = allowCommunity ? [...traits, ...$communityTraitsStore] : traits;
		trait = pool[Math.floor(Math.random() * pool.length)];
	};
</script>

<svelte:head>
	<title>FistREF - Random Role</title>
</svelte:head>

<div class="controls">
	<IconButton label="REROLL" size={24} on:click={reroll} />
	<label class="toggle">
		<input
			type="checkbox"
			bind:checked={allowCommunity}
			on:change={toggleCommunity}
			disabled={isLoadingCommunity}
		/>
		<span class={clsx({ community: allowCommunity, bold: allowCommunity })}
			>[INCLUDE COMMUNITY CONTENT]</span
		>
	</label>
</div>
<h1>Trait # {formatTraitRoleNumber(trait.number, true, isCommunity)}: {trait.name}</h1>
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
		accent-color: var(--color-community);
	}
</style>
