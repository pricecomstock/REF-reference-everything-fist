<script lang="ts">
	const changelog: Record<string, string[]> = {
		'26 OCT 2023': [
			'--Initial creation--',
			'Traits index',
			'Roles index',
			'Dice table',
			'Random trait',
			'Random role',
			'Random merc',
			'Dark mode'
		],
		'27 OCT 2023': ['Fix trait formatting', "Use lulu's new JSON", 'Improved random merc'],
		'01 NOV 2023': ['Add rerolls to random merc'],
		'04 NOV 2023': [
			'Add quick search',
			'Move random generation to client to make things faster and less network dependent',
			'Fancy animations'
		],
		'10 OCT 2025': ['Add community roles and traits']
	};
</script>

<h1>Changelog & Wishlist</h1>

<div class="wishlist">
	<h2>Wishlist</h2>
	<ul>
		<li><s>Search</s></li>
		<li><s>Improved merc generator</s></li>
		<li>Filtering</li>
		<li><s>Community content</s></li>
		<li>Offline mode</li>
		<li>Printable References</li>
	</ul>
</div>

<div class="changelog">
	<h2>Changelog</h2>
	<div class="changelog-entries">
		{#each Object.entries(changelog).reverse() as [date, items], index}
			<div class="date">{date}</div>
			<ul class="items">
				{#each items as item}
					<li>{item}</li>
				{/each}
			</ul>
		{/each}
	</div>
</div>

<style>
	.changelog,
	.wishlist {
		margin: auto;
		max-width: 50ch;
	}

	.changelog-entries {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 2rem 1.5rem;
	}

	ul {
		margin: 0;
	}

	li {
		margin-bottom: 0.35rem;
	}

	.date {
		text-align: right;
	}
</style>
