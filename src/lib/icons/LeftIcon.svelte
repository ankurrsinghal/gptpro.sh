<script lang="ts">
	import type { IconSize } from '$lib/types';
	import BaseIcon from './BaseIcon.svelte';

	export let size: IconSize = 'medium';
</script>

<BaseIcon {size}>
	<path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
</BaseIcon>
