<script lang="ts">
	import type { Role } from '$lib/roles';
	import type { Trait } from '$lib/traits';
	import RoleDetails from './RoleDetails.svelte';
	import TraitDetails from './TraitDetails.svelte';

	import { Link } from 'lucide-svelte';

	export let trait: Trait | undefined = undefined;
	export let role: Role | undefined = undefined;

	export let showLink = true;
</script>

<div class="number-block">
	<div class="number">
		<p>{trait?.number ?? role?.number}.</p>
		{#if showLink}
			<p>
				{#if trait}
					<a href={`/trait/${trait?.name.toLowerCase()}`}>
						<Link size="20" />
					</a>
				{:else}
					<a href={`/role/${role?.name.toLowerCase()}`}>
						<Link size="20" />
					</a>
				{/if}
			</p>
		{/if}
		<!-- {#if trait?.stats}
			{#each Object.entries(trait.stats) as [key, value]}
				<span class={`stat ${STAT_ABBREVIATIONS[key]?.toLowerCase()}`}
					>{value} {STAT_ABBREVIATIONS[key]}</span
				>
			{/each}
		{/if} -->
	</div>
	<div class="details">
		{#if trait}
			<TraitDetails {trait} />
		{:else if role}
			<RoleDetails {role} />
		{/if}
	</div>
</div>

<style>
	.number-block {
		display: grid;
		grid-template-columns: 6ch 1fr;
		gap: 0.75rem;

		max-width: 65ch;
		margin: auto;
	}

	.number {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;

		font-weight: bold;
		text-align: right;
		padding: 0 0.75rem;
		border-right: var(--accent) 2px solid;
	}
</style>
