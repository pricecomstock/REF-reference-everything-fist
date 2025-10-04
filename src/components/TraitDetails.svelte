<script lang="ts">
	import type { CommunityTrait, Trait } from '$lib/traits';

	export let trait: Trait | CommunityTrait;
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
		/* This means we can just use normal spaces and newlines in this block */
		white-space: pre-wrap;
	}

	ul {
		margin: 0;
	}

	li {
		margin-left: -0.5rem;
	}
</style>
