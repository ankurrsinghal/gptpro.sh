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

<div class="w-full bg-white bottom-2 space-x-5 text-sm p-4 shadow flex items-center justify-center">
	<textarea
		use:textareaAutosizeAction
		use:hotKeyAction={{ code: 'Enter', cb: onSend }}
		bind:this={localRef}
		bind:value={$value}
		{disabled}
		class="w-full border-2 border-black px-2 py-1 rounded-md outline-none bg-white text-black focus-within:border-blue-700 disabled:opacity-30 disabled:pointer-events-none"
	/>
	<button
		class="flex w-8 h-8 rounded-full bg-black items-center justify-center text-white font-mono disabled:opacity-30 disabled:pointer-events-none"
		on:click={onSend}
		{disabled}
	>
		<SendIcon tailwindClass="w-4 h-4" />
	</button>
</div>
