<script lang="ts">
	import NumberBlock from '$components/NumberBlock.svelte';
	import { getRandomTrait } from '$lib/traits';

	import IconButton from '$components/IconButton.svelte';

	let trait = getRandomTrait();

	const reroll = () => {
		trait = getRandomTrait();
	};
</script>

<svelte:head>
	<title>FistREF - Random Role</title>
</svelte:head>

<div class="reroll-container">
	<IconButton label="REROLL" size={24} on:click={reroll} />
</div>
<h1>Trait #{trait.number}: {trait.name}</h1>
<NumberBlock {trait} />

<style>
	h1 {
		text-align: center;
		margin-bottom: 3rem;
	}
	.reroll-container {
		text-align: center;
		margin: 2rem auto;
	}
</style>
