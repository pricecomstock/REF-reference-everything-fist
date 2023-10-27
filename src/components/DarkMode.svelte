<script lang="ts">
	import { fly } from 'svelte/transition';
	import { theme, toggleTheme } from '$lib/theme';
	import { Moon, Sun } from 'lucide-svelte';
</script>

<button on:click={toggleTheme}>
	{#if $theme === 'light'}
		<div in:fly={{ y: -10 }}>
			<Moon size="32" />
			Dark
		</div>
	{:else}
		<div in:fly={{ y: 10 }}>
			<Sun size="32" />
			Light
		</div>
	{/if}
</button>

<style>
	button {
		background: none;
		padding: 0;
		border: none;
		cursor: pointer;
		font-weight: inherit;
		box-shadow: none;

		color: currentColor;
	}

	button > * {
		display: flex;
		gap: 0.25rem;
	}

	button > div {
		display: flex;
		align-items: center;
		gap: 0.25rem;
	}
</style>
