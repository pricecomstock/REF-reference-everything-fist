<script lang="ts">
	import NumberBlock from '$components/NumberBlock.svelte';
	import { getRandomRole, roles } from '$lib/roles';
	import { communityRoles as communityRolesStore } from '$lib/community';
	import { communityEnabled, communityUnlocked } from '$lib/stores/communityPreferences';

	import IconButton from '$components/IconButton.svelte';
	import CommunityToggle from '$components/CommunityToggle.svelte';
	import { formatTraitRoleNumber } from '$lib/util';

	let role = getRandomRole();
	$: isCommunity = 'author' in role;

	const reroll = () => {
		const pool = $communityEnabled ? [...roles, ...$communityRolesStore] : roles;
		role = pool[Math.floor(Math.random() * pool.length)];
	};
</script>

<svelte:head>
	<title>FistREF - Random Role</title>
</svelte:head>

<div class="controls">
	<IconButton label="REROLL" size={24} on:click={reroll} />
	{#if $communityUnlocked}
		<CommunityToggle />
	{/if}
</div>
<h1>Role # {formatTraitRoleNumber(role.number, false, isCommunity)}: {role.name}</h1>
<NumberBlock {role} />

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
