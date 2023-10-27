<script lang="ts">
	import { page } from '$app/stores';
	import { Zap, Sparkle, Dice6, Dices } from 'lucide-svelte';

	const navItems = [
		{
			name: 'Traits Index',
			link: '/traits',
			icon: Zap
		},
		{
			name: 'Roles Index',
			link: '/roles',
			icon: Sparkle
		},
		{
			name: 'Dice Table',
			link: '/table',
			icon: Dice6
		},
		{
			name: 'Random Trait',
			link: '/random-trait',
			icon: Dices
		},
		{
			name: 'Random Role',
			link: '/random-role',
			icon: Dices
		},
		{
			name: 'Random Merc',
			link: '/random-merc',
			icon: Dices
		}
	];
</script>

<nav>
	{#each navItems as navItem}
		<div class={`nav-block ${$page.route.id?.startsWith(navItem.link) ? 'current' : ''}`}>
			<a class="icon-link" href={navItem.link}
				><svelte:component this={navItem.icon} size="20" />{navItem.name}</a
			>
		</div>
	{/each}
</nav>

<style>
	nav {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		margin: 1rem;
		gap: 0.25rem 0.9rem;
	}

	.current {
		border-bottom: 2px solid var(--text);
	}

	.nav-block {
		text-transform: uppercase;
		padding: 0 0.1rem;
	}
</style>
