<script lang="ts">
	import type { Role } from '$lib/roles';

	export let role: Role;
</script>

<div>
	<p class="effect">
		<b>{role.name}:</b>
		{role.text}
	</p>
</div>

<style>
</style>
