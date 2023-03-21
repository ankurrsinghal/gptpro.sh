<script lang="ts">
	import type { IconSize } from '$lib/types';
	export let size: IconSize = 'medium';
	export let fill: string = 'none';
	export let stroke: string = 'currentColor';
	$: sizeClass = size === 'large' ? 'w-6 h-6' : size === 'medium' ? 'w-4 h-4' : 'w-3 h-3';
</script>

<svg
	{fill}
	{stroke}
	xmlns="http://www.w3.org/2000/svg"
	viewBox="0 0 24 24"
	stroke-width="1.5"
	class={sizeClass}
>
	<slot />
</svg>
