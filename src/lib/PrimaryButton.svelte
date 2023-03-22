<script>
	import { PrimaryButtonStyles } from './Styles';
</script>

<button {...$$props} on:click class={PrimaryButtonStyles}>
	<slot />
	{#if $$slots.icon}
		<span><slot name="icon" /></span>
	{/if}
</button>
