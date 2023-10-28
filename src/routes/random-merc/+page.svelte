<script lang="ts">
	import NumberBlock from '$components/NumberBlock.svelte';
	import type { Stats, Trait } from '$lib/traits';
	import type { PageServerData } from './$types';
	export let data: PageServerData;
	$: ({ codename, role, traits } = data);

	$: stats = traits.reduce((acc, trait) => {
		Object.entries(trait.stats).forEach(([key, value]) => {
			acc[key as keyof Stats] = (acc[key as keyof Stats] || 0) + value;
		});
		return acc;
	}, {} as Stats);
</script>

<h1>Random Merc</h1>
<div class="merc">
	<div class="description">
		<p class="codename">
			<span class="field">CODENAME:</span> <span class="bold">{codename}</span>
		</p>
		<p><span class="field">ROLE:</span> <span class="bold">{role.name}</span> ({role.number})</p>
		<p>
			<span class="field">TRAITS:</span>
			{#each traits as trait, i}
				<span class="bold">{trait.name}</span> ({trait.number}){i === traits.length - 1 ? '' : ', '}
			{/each}
		</p>
	</div>

	<h2>Role</h2>
	<NumberBlock {role} />
	<h2>Traits</h2>
	{#each traits as trait}
		<NumberBlock {trait} />
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
		border-radius: 0.25rem;
	}
</style>
