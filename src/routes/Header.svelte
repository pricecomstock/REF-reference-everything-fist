<script lang="ts">
	import DarkMode from '$components/DarkMode.svelte';
</script>

<div class="header">
	<a class="logo" href="/">
		<h1>FIST Online Traits Index</h1>
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

	.header h1 {
		font-size: 1.75rem;
	}

	.logo {
		text-decoration: none;
	}

	.header img {
		max-width: min(10rem, 20vw);
		margin: 0.5rem;
	}

	.header-right {
		display: flex;
		align-items: center;
	}
</style>
