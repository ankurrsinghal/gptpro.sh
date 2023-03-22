<script lang="ts">
	import { onMount } from 'svelte';
	import LoaderSpin from './LoaderSpin.svelte';

	const messages = [
		'Sending the request to GPT',
		'GPT is preparing the reply',
		'Sometimes longer messages take a while on network to arrive',
		'OpenAI must be going through a huge traffic'
	];
	let currentMessageIndex = 0;

	onMount(() => {
		setInterval(() => {
			currentMessageIndex = (currentMessageIndex + 1) % messages.length;
		}, 2500);
	});
</script>

<div class="text-center mx-auto flex items-center bg-gray-100 py-2 px-3 rounded-full">
	{#each messages as message, index}
		{#if currentMessageIndex === index}
			<span class="text-[12px] mr-4">{message}.</span>
		{/if}
	{/each}
	<LoaderSpin size={20} />
</div>
