<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { hotKeyAction, textareaAutosizeAction } from 'svelte-legos';
	import type { Writable } from 'svelte/store';
	import SendIcon from './icons/SendIcon.svelte';

	export let disabled: boolean;
	export let ref: Writable<HTMLTextAreaElement | null>;
	export let onSend: () => void;
	export let value: Writable<string>;

	let localRef: HTMLTextAreaElement;

	onMount(() => {
		ref.set(localRef);
	});

	onDestroy(() => {
		ref.set(null);
	});
</script>

<div
	class="w-full bg-white bottom-2 space-x-5 text-sm p-4 shadow flex items-center justify-center border-t border-[var(--border-color)]"
>
	<textarea
		use:textareaAutosizeAction
		use:hotKeyAction={{ code: 'Enter', cb: onSend }}
		bind:this={localRef}
		bind:value={$value}
		{disabled}
		placeholder="Enter your message"
		class="w-full border resize-none border-[var(--border-color)] focus:border-black px-4 py-2 rounded-md outline-none bg-white text-black disabled:opacity-30 disabled:pointer-events-none"
	/>
	<button
		class="flex w-8 h-8 aspect-square rounded-full bg-black items-center justify-center text-white font-mono disabled:opacity-30 disabled:pointer-events-none"
		on:click={onSend}
		{disabled}
	>
		<SendIcon />
	</button>
</div>
