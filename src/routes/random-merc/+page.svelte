<script lang="ts">
	import NumberBlock from '$components/NumberBlock.svelte';
	import type { PageServerLoad } from './$types';
	export let data: PageServerLoad;
	$: ({ codename, role, traits } = data);
</script>

<h1>Random Merc</h1>
<div class="merc">
	<p><span class="field">CODENAME:</span> {codename}</p>
	<p><span class="field">ROLE:</span> {role.name}</p>
	<p><span class="field">TRAITS:</span> {traits.map((t) => t.name).join(', ')}</p>

	<h2>Role</h2>
	<NumberBlock {role} />
	<h2>Traits</h2>
	{#each traits as trait}
		<NumberBlock {trait} />
	{/each}
</div>

<style>
	.merc {
		max-width: 45rem;
		margin: auto;
	}
	.field {
		font-weight: bold;
	}
</style>
