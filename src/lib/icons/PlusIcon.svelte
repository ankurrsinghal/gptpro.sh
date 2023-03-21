<script lang="ts">
	import type { IconSize } from '$lib/types';
	import BaseIcon from './BaseIcon.svelte';

	export let size: IconSize = 'medium';
</script>

<BaseIcon {size}>
	<path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
</BaseIcon>
