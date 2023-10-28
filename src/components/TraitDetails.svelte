<script lang="ts">
	import type { Trait } from '$lib/traits';

	export let trait: Trait;
	$: formattedEffect = trait.effect.replaceAll(/\n(\d.)/gi, '\n    $1');
</script>

<div>
	<p class="effect">
		<b>{trait.name}:</b>
		{formattedEffect}
	</p>
	<ul class="stats-list">
		<li>{trait.item}</li>
		<li>{trait.stat}</li>
	</ul>
</div>

<style>
	.effect {
		white-space: pre-wrap;
	}
	ul,
	ol {
		margin: 0;
	}
	li {
		margin-left: -0.5rem;
	}
</style>
