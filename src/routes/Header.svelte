<script lang="ts">
	import DarkMode from '$components/DarkMode.svelte';
</script>

<div class="header">
	<a class="logo" href="/">
		<span>R.E.F.</span>
	</a>
	<div class="header-right">
		<DarkMode />
	</div>
</div>

<style>
	.header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin: 1rem;
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
	}
</style>
