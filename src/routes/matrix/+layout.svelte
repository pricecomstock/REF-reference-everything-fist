<script lang="ts">
	import type { LayoutServerData } from './$types';
	export let data: LayoutServerData;
	$: ({ standardMatrices } = data);
</script>

<h1>Intelligence Matrix</h1>
<div class="matrix-layout">
	<nav>
		<a href="/matrix/mission">Mission Generator</a>
		{#each Object.keys(standardMatrices) as standardMatrixKey}
			<a href={`/matrix/${standardMatrixKey}`}>{standardMatrixKey.toUpperCase()}</a>
			<!-- content here -->
		{/each}
	</nav>

	<div class="page">
		<slot><!-- optional fallback --></slot>
	</div>
</div>

<style>
	.matrix-layout {
		display: grid;
		grid-template-columns: 15rem 1fr;
	}

	nav {
		display: flex;
		flex-direction: column;

		view-transition-name: matrixlist;
	}

	h1 {
		view-transition-name: matrixheader;
	}
</style>
