<script lang="ts">
	import { RefreshCcw } from 'lucide-svelte';
	export let icon = RefreshCcw;
	export let size: number = 24;
	export let label: string = '';
</script>

<button on:click>
	<div style={`font-size: ${size * 0.65}px; padding: ${size * 0.25}px 0;`}>
		<svelte:component this={icon} {size} />
		{#if label}
			<span class="label">{label}</span>
		{/if}
	</div>
</button>

<style>
	button {
		background: none;
		padding: 0 0.5rem;
		border: none;
		cursor: pointer;
		font-weight: inherit;
		box-shadow: none;

		color: var(--background);
		background-color: var(--text);

		/* If there's a weird issue, maybe delete this */
		vertical-align: top;

		border: 2px solid var(--text);
		border-radius: var(--border-radius);

		transition: all 0.15s ease;
	}

	button:hover {
		background-color: var(--background);
		color: var(--text);
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

	.label {
		line-height: 65%;
	}
</style>
