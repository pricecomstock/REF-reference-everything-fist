<script lang="ts">
	import NumberBlock from '$components/NumberBlock.svelte';
	import { communityRoles, loadCommunityRoles } from '$lib/community';
	import { onMount } from 'svelte';

	onMount(async () => {
		await loadCommunityRoles();
	});
</script>

<svelte:head>
	<title>FistREF - Community Roles Index</title>
</svelte:head>

<h1>Community Roles Index</h1>
<p>There are {$communityRoles.length} community roles</p>
{#each $communityRoles as role}
	<div>
		<NumberBlock {role} />
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
