<script lang="ts">
	import NumberBlock from '$components/NumberBlock.svelte';
	import IconButton from '$components/IconButton.svelte';
	import type { Stats, Trait } from '$lib/traits';
	import type { PageServerData } from './$types';
	import { merc, rerollCodename, rerollMerc, rerollRole, rerollTrait } from './randomMercStore';
	import { onMount } from 'svelte';

	onMount(() => {
		rerollMerc();
	});

	$: stats = $merc.traits.reduce((acc, trait) => {
		Object.entries(trait.stats).forEach(([key, value]) => {
			acc[key as keyof Stats] = (acc[key as keyof Stats] || 0) + value;
		});
		return acc;
	}, {} as Stats);
</script>

<h1>Random Merc</h1>
<div class="top-actions">
	<IconButton label="REROLL ALL" size={24} on:click={rerollMerc} />
</div>
<div class="merc">
	<div class="description">
		<p class="codename">
			<span class="field">CODENAME:</span> <span class="bold">{$merc.codename}</span>
			<span class="inline-button">
				<IconButton size={16} on:click={rerollCodename} />
			</span>
		</p>
		<p>
			<span class="field">ROLE:</span> <span class="bold"> {$merc.role.name}</span> ({$merc.role
				.number})
		</p>
		<p>
			<span class="field">TRAITS:</span>
			{#each $merc.traits as trait, i}
				<span class="bold">{trait.name}</span> ({trait.number}){i === $merc.traits.length - 1
					? ''
					: ', '}
			{/each}
		</p>
	</div>

	<h2>Role</h2>
	<div class="rerollable-block">
		<NumberBlock role={$merc.role} />
		<IconButton size={16} on:click={rerollRole} />
	</div>
	<h2>Traits</h2>
	{#each $merc.traits as trait, index}
		<div class="rerollable-block">
			<NumberBlock {trait} />
			<IconButton
				size={16}
				on:click={() => {
					rerollTrait(index);
				}}
			/>
		</div>
	{/each}

	<div class="stats">
		<div class="stat">
			<div class="name">FORCEFUL</div>
			<div class="value">{stats.FRC ?? 0}</div>
		</div>
		<div class="stat">
			<div class="name">TACTICAL</div>
			<div class="value">{stats.TAC ?? 0}</div>
		</div>
		<div class="stat">
			<div class="name">CREATIVE</div>
			<div class="value">{stats.CRE ?? 0}</div>
		</div>
		<div class="stat">
			<div class="name">REFLEXIVE</div>
			<div class="value">{stats.RFX ?? 0}</div>
		</div>
	</div>
	<!-- <div class="stats">
		<div class="stat">
			<div class="name">ARMOR</div>
			<div class="value">{stats.ARMOR ? `${stats.ARMOR}*` : 0}</div>
		</div>
		<div class="stat">
			<div class="name">MAX HP</div>
			<div class="value">{stats.MAX_HP ?? 0}</div>
		</div>
	</div> -->
</div>

<style>
	.top-actions {
		margin: 1rem auto 2rem;
		display: flex;
		justify-content: center;
	}
	.description {
		margin: auto;
	}
	.codename {
		font-size: 1.5rem;
	}
	.merc {
		max-width: 45rem;
		margin: auto;
	}
	.field {
		font-weight: normal;
	}
	.bold {
		font-weight: bold;
	}

	.rerollable-block {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.5rem;

		/* This helps visually center and cram more text on mobile */
		margin-left: -1rem;
	}

	.stats {
		display: grid;
		grid-template-columns: repeat(2, 12rem);
		grid-gap: 1rem;
		justify-items: end;
		justify-content: center;

		max-width: 31rem;
		margin: 2rem auto;
	}

	.stat {
		display: flex;
		align-items: center;
		justify-content: flex-end;
	}

	.stat > .name {
		font-size: 1.5rem;
		font-weight: bold;
	}

	.stat > .value {
		font-size: 2rem;
		font-weight: bold;
		background-color: var(--text);
		color: var(--background);
		margin-left: 0.75rem;
		width: 3rem;
		text-align: center;
		border-radius: var(--border-radius);
	}

	.inline-button {
		display: inline-flex;
		/* margin: 0rem 0.25rem; */
	}
</style>
