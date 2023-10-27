<script lang="ts">
	import type { PageServerLoad } from '../traits/$types';
	export let data: PageServerLoad;
	$: ({ traits, roles } = data);
</script>

<h1>Traits & Roles Table</h1>
<p>Click any item to view details.</p>
<h2>Traits</h2>
<div class="item-table traits">
	{#each traits as trait}
		<div>
			<a href={`/trait/${trait.name.toLowerCase()}`}
				><span class="number">{trait.number}.</span> {trait.name}</a
			>
		</div>
	{/each}
</div>

<h2>Roles</h2>
<div class="item-table roles">
	{#each roles as role}
		<div>
			<a href={`/role/${role.name.toLowerCase()}`}
				><span class="number">{role.number}.</span> {role.name}</a
			>
		</div>
	{/each}
</div>

<style>
	a {
		text-decoration: none;
	}

	.item-table {
		margin: auto;

		font-size: 0.75rem;
	}

	.item-table.traits {
		grid-auto-flow: column;

		display: grid;
		/* grid-template-columns: repeat(auto-fill, minmax(10rem, 1fr)); */
		grid-template-rows: repeat(auto-fill, 1rem);
		min-height: 24rem;

		max-width: 1300px;
	}

	.item-table.roles {
		grid-auto-flow: column;

		display: grid;
		/* grid-template-columns: repeat(auto-fill, minmax(10rem, 1fr)); */
		grid-template-rows: repeat(auto-fill, 1rem);
		min-height: 6rem;

		max-width: 800px;
	}

	@media screen and (max-width: 1100px) {
		.item-table.traits {
			min-height: 48rem;
		}
	}
	@media screen and (max-width: 700px) {
		.item-table.traits {
			min-height: 72rem;
		}

		.item-table.roles {
			min-height: 12rem;
		}
	}
	@media screen and (max-width: 374px) {
		.item-table.traits {
			display: flex;
			flex-direction: column;
		}

		.item-table.roles {
			min-height: 36rem;
		}
	}

	.number {
		font-weight: bold;
	}

	p {
		text-align: center;
	}
</style>
