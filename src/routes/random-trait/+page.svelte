<script lang="ts">
	import NumberBlock from '$components/NumberBlock.svelte';
	import { getRandomTrait, traits } from '$lib/traits';
	import { communityTraits as communityTraitsStore } from '$lib/community';
	import { communityEnabled } from '$lib/stores/communityPreferences';
	import type { Trait } from '$lib/traits';

	import IconButton from '$components/IconButton.svelte';
	import CommunityToggle from '$components/CommunityToggle.svelte';
	import { formatTraitRoleNumber } from '$lib/util';

	let trait = getRandomTrait();
	$: isCommunity = 'author' in trait;

	const reroll = () => {
		const pool = $communityEnabled ? [...traits, ...$communityTraitsStore] : traits;
		trait = pool[Math.floor(Math.random() * pool.length)];
	};
</script>

<svelte:head>
	<title>FistREF - Random Role</title>
</svelte:head>

<div class="controls">
	<IconButton label="REROLL" size={24} on:click={reroll} />
	<CommunityToggle />
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
</style>
