<script lang="ts">
	import NumberBlock from '$components/NumberBlock.svelte';
	import { communityTraits, loadCommunityTraits } from '$lib/community';
	import { onMount } from 'svelte';

	onMount(async () => {
		await loadCommunityTraits();
	});
</script>

<svelte:head>
	<title>FistREF - Community Traits Index</title>
</svelte:head>

<h1>Community Traits Index</h1>
<p>There are {$communityTraits.length} community traits</p>
{#each $communityTraits as trait}
	<div>
		<NumberBlock {trait} />
	</div>
{/each}

<style>
	div {
		margin: 1.5rem auto;
	}
	p {
		text-align: center;
	}
</style>
