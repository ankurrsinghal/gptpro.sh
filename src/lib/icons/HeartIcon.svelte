<script lang="ts">
	import type { IconSize } from '$lib/types';
	import BaseIcon from './BaseIcon.svelte';

	export let size: IconSize = 'medium';
	export let fill: string = 'none';
	export let stroke: string = 'currentColor';
</script>

<BaseIcon {size} {fill} {stroke}>
	<path
		stroke-linecap="round"
		stroke-linejoin="round"
		d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
	/>
</BaseIcon>
