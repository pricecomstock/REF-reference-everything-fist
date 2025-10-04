<script lang="ts">
	import type { CommunityRole, Role } from '$lib/roles';

	export let role: Role | CommunityRole;
</script>

<div>
	<p class="effect">
		<b>{role.name}:</b>
		{role.text}
	</p>
</div>

<style>
</style>
