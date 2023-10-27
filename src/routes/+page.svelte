<script lang="ts">
	import { Triangle, SquareCode, Book } from 'lucide-svelte';
</script>

<h1>The R.E.F.</h1>
<p class="subtitle"><u>R</u>EFERENCE of <u>E</u>VERYTHING <u>F</u>IST</p>
<div class="instructions">
	<p>Click an item above to get started.</p>
</div>

<div class="links">
	<a class="icon-link" href="https://claymorerpgs.itch.io/fist"><Book size="24" />GET FIST</a>
	<a class="icon-link" href="/changelog"><Triangle size="24" />CHANGELOG & WISHLIST</a>
	<a class="icon-link" href="https://github.com/pricecomstock/fist-tools"
		><SquareCode size="24" />SOURCE CODE</a
	>
</div>

<style>
	div {
		max-width: 50ch;
		margin: auto;
	}

	.subtitle {
		text-align: center;
		font-size: 1.5rem;
		margin-bottom: 2rem;
	}

	.instructions {
		text-align: center;
		margin: 3rem auto;
	}

	.links {
		max-width: 25ch;
	}
</style>
