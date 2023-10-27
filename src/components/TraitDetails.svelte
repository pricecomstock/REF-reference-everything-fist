<script lang="ts">
	import type { Trait } from '$lib/traits';

	export let trait: Trait;
</script>

<div>
	<p class="effect">
		<b>{trait.name}:</b>
		{trait.effect}
	</p>
	<p class="stats">-&nbsp;&nbsp;{trait.item}, {trait.stat}</p>
	<!-- <ul class="stats-list">
		<li>{trait.item}</li>
		<li>{trait.stat}</li>
	</ul> -->
</div>

<style>
	p.stats {
		padding-left: 1rem;
	}
</style>
