<script lang="ts">
	import CommunityToggle from '$components/CommunityToggle.svelte';
	import { communityUnlocked } from '$lib/stores/communityPreferences';

	import communityMetadata from '$lib/json/community_metadata.json';
	import { format } from 'date-fns';
	import { Sparkle, Zap } from 'lucide-svelte';

	const lastSyncDate = new Date(communityMetadata.lastSyncedAt);
	const formattedDate = format(lastSyncDate, 'dd MMM yyyy').toUpperCase();

	function handleLock() {
		communityUnlocked.lock();
	}
</script>

<svelte:head>
	<title>FistREF - Community Content</title>
</svelte:head>

<div class="community-page">
	<h1>Community Content</h1>
	<p>
		Community traits and roles are created by the FIST community and synced to this website
		occasionally (most recently: {formattedDate}).
	</p>
	<p>
		These are homebrew. They are not part of the official game. They may not be balanced, and the
		formatting may be <i>weird</i>. If you want to play with them, check with your ref!
	</p>
	<div class="index-links">
		<a class="icon-link community" href="/community/traits"><Zap />COMMUNITY TRAITS INDEX</a>
		<a class="icon-link community" href="/community/roles"><Sparkle />COMMUNITY ROLES INDEX</a>
	</div>
	<p>
		Clicking the button below will allow you to include community content in the random generators
		on this website.
	</p>
	<div class="unlock-wrapper">
		<CommunityToggle />
	</div>
	{#if $communityUnlocked}
		<button class="lock-button" on:click={handleLock}>
			Had enough? Click here to [HIDE COMMUNITY CONTENT TOGGLES]
		</button>
	{/if}
</div>

<style>
	.community-page {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
		margin: 2rem auto;
		max-width: 600px;
		padding: 0 1rem;
	}

	h1 {
		text-align: center;
		margin-bottom: 1rem;
	}

	p {
		text-align: left;
		font-size: 1.1rem;
	}

	.unlock-wrapper {
		margin-top: 1rem;
	}

	.lock-button {
		margin-top: 1rem;
		padding: 0.5rem 1rem;
		background-color: transparent;
		border: 2px solid var(--text);
		border-radius: var(--border-radius);
		color: var(--text);
		font-weight: bold;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.lock-button:hover {
		background-color: var(--text);
		color: var(--background);
	}

	.index-links {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.index-links a.community {
		color: var(--color-community);
	}
</style>
