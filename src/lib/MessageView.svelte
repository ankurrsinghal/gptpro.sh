<script lang="ts">
	import { clickToCopyAction } from 'svelte-legos';
	import type { ChatMessage } from '$lib/types';
	import ClipboardIcon from './icons/ClipboardIcon.svelte';
	import LoaderSpin from './LoaderSpin.svelte';

	export let message: ChatMessage;

	$: isAssistant = message.from === 'assistant';

	let isLoading = false;

	function handleCopyDone() {
		setTimeout(() => {
			isLoading = false;
		}, 500);
	}
</script>

<div
	class={[
		'relative',
		'max-w-[85%] lg:max-w-[60%]',
		'whitespace-pre-wrap',
		'px-3 py-2',
		'rounded-md',
		'shadow-md',
		'shadow-gray-100',
		'leading-relaxed',
		'border border-[var(--border-color)]',
		'text-sm',
		'font-normal',
		!isAssistant ? 'bg-gray-100 text-black ml-auto' : 'bg-white mr-auto text-black pr-[2rem]'
	].join(' ')}
>
	<span>{message.content}</span>
	{#if isAssistant}
		<button
			class="absolute top-0 right-0 p-2 cursor-pointer"
			use:clickToCopyAction={message.content}
			on:click={() => (isLoading = true)}
			on:copy-done={handleCopyDone}
			on:copy-error={handleCopyDone}
		>
			{#if isLoading}
				<LoaderSpin />
			{:else}
				<ClipboardIcon />
			{/if}
		</button>
	{/if}
</div>
