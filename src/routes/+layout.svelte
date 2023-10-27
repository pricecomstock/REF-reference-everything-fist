<script lang="ts">
	import '../reset.css';
	import '../styles.css';
	import Footer from './Footer.svelte';
	import Header from './Header.svelte';
	import Nav from './Nav.svelte';
</script>

<div class="layout">
	<Header />
	<Nav />
	<div class="page">
		<slot><!-- optional fallback --></slot>
	</div>
	<div class="footer">
		<Footer />
	</div>
</div>

<style>
	.page {
		max-width: 100%;
		margin: 1rem 1rem 5rem 1rem;
	}

	.footer {
		padding: 1rem;
		text-align: center;
	}
</style>
