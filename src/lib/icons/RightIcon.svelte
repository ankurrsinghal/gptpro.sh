<script lang="ts">
	import type { IconSize } from '$lib/types';
	import BaseIcon from './BaseIcon.svelte';

	export let size: IconSize = 'medium';
</script>

<BaseIcon {size}>
	<path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
</BaseIcon>
