<script lang="ts">
	import type { IconSize } from '$lib/types';
	import BaseIcon from './BaseIcon.svelte';

	export let size: IconSize = 'medium';
</script>

<BaseIcon {size}>
	<path
		stroke-linecap="round"
		stroke-linejoin="round"
		d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
	/>
</BaseIcon>
