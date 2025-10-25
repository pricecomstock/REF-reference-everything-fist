<script lang="ts">
	import DarkMode from '$components/DarkMode.svelte';
	import Search from '$components/SearchBar.svelte';
</script>

<div class="header">
	<a class="logo" href="/">
		<span>R.E.F.</span>
	</a>
	<div class="header-right">
		<Search />
		<DarkMode />
	</div>
</div>

<style>
	.header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin: 1rem;

		view-transition-name: header;
	}

	.logo {
		font-family: var(--header-font);
		font-size: 1.75rem;
		text-decoration: none;
		-webkit-text-stroke: 0.15rem;
		letter-spacing: 0.3rem;
	}

	.header-right {
		display: flex;
		align-items: center;
		gap: 1rem;
	}
</style>
