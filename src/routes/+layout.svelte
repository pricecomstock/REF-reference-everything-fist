<script lang="ts">
	import '../reset.css';
	import '../styles.css';
	import Footer from './Footer.svelte';
	import Header from './Header.svelte';
</script>

<div class="layout">
	<Header />
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
		margin: 1rem 0.5rem 5rem 0.5rem;
	}

	.footer {
		padding: 1rem;
		text-align: center;
	}
</style>
