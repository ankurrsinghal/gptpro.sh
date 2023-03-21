<button
	{...$$props}
	on:click
	class="text-sm flex items-center justify-center rounded-md border border-gray-300 bg-white py-1 px-2 transition-all hover:border-gray-800"
>
	<slot />
	{#if $$slots.icon}
		<span><slot name="icon" /></span>
	{/if}
</button>
