<script lang="ts">
	import NumberBlock from '$components/NumberBlock.svelte';
	import { getRandomRole } from '$lib/roles';

	import IconButton from '$components/IconButton.svelte';

	let role = getRandomRole();

	const reroll = () => {
		role = getRandomRole();
	};
</script>

<svelte:head>
	<title>FistREF - Random Role</title>
</svelte:head>

<div class="reroll-container">
	<IconButton label="REROLL" size={24} on:click={reroll} />
</div>
<h1>Role #{role.number}: {role.name}</h1>
<NumberBlock {role} />

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
