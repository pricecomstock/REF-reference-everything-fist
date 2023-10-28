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
		'27 OCT 2023': ['Fix trait formatting', "Use lulu's new JSON", 'Improved random merc']
	};
</script>

<h1>Changelog & Wishlist</h1>

<div class="changelog">
	<h2>Changelog</h2>
	<div class="changelog-entries">
		{#each Object.entries(changelog).reverse() as [date, items]}
			<div class="date">{date}</div>
			<div class="items">
				{#each items as item}
					<p>{item}</p>
				{/each}
			</div>
		{/each}
	</div>
</div>

<div class="wishlist">
	<h2>Wishlist</h2>
	<ul>
		<li>Filtering & Search</li>
		<li>Improved merc generator</li>
		<li>Community content</li>
		<li>Offline mode</li>
		<li>Printable References</li>
	</ul>
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
		gap: 1rem;
	}

	.date {
		text-align: right;
	}
</style>
