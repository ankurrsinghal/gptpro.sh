<script lang="ts">
	import { onMount } from 'svelte';
	import { hotKeyAction } from 'svelte-legos';
	import { SetKeyIfPossible } from './APIKeyStore';
	import ExternalIcon from './icons/ExternalIcon.svelte';
	import RightIcon from './icons/RightIcon.svelte';

	const DefaultLabel = 'Get Started';

	export let initialValue: string | null = '';
	export let CTALabel = DefaultLabel;
	export let onDone: () => void = () => {};

	let key = initialValue || '';
	let disabled = false;
	let isError = false;
	let inputRef: HTMLInputElement;

	const errorMessage = 'Invalid API key. Please make sure your API key is still working properly.';

	function onGetStarted() {
		if (key.trim().length > 0) {
			disabled = true;
			SetKeyIfPossible(key)
				.then(() => {
					console.log('Key is valid');
					onDone();
				})
				.catch((e) => {
					isError = true;
				})
				.finally(() => {
					disabled = false;
					setTimeout(() => {
						inputRef?.focus();
					}, 1);
				});
		}
	}

	onMount(() => {
		inputRef?.focus();
	});
</script>

<div class="relative flex items-center mx-auto w-full max-w-xl px-2.5 sm:px-0">
	<span class="absolute inset-y-0 left-0 my-2 ml-4 w-5 text-gray-400 lg:ml-3">🔑</span>
	<input
		use:hotKeyAction={{ code: 'Enter', cb: onGetStarted }}
		{disabled}
		bind:value={key}
		bind:this={inputRef}
		type="text"
		placeholder="Enter your OpenAI API key (sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx)"
		class="peer block w-full rounded-md border border-gray-200 bg-white p-2 pl-8 text-sm shadow-lg lg:pl-10 focus:border-black focus:outline-none focus:ring-0 disabled:pointer-events-none disabled:opacity-75"
	/>
</div>
{#if isError}
	<div class="mt-4 text-sm mx-auto text-red-500 text-center">
		{errorMessage}
	</div>
{/if}
<div class="mx-auto mt-10 max-w-fit flex flex-col space-y-2 lg:flex-row lg:space-y-0 lg:space-x-4">
	<button
		on:click={onGetStarted}
		{disabled}
		class="flex items-center justify-center rounded-full border border-black bg-black py-2 px-5 text-white shadow-lg transition-all hover:bg-white hover:text-black disabled:pointer-events-none disabled:opacity-75"
		>{CTALabel}
		{#if CTALabel === DefaultLabel}
			<span class="ml-2"><RightIcon /></span>
		{/if}
	</button>
	<a
		class="flex items-center justify-center space-x-2 rounded-full border border-gray-300 bg-white py-2 px-5 shadow-lg transition-all hover:border-gray-800"
		href="https://platform.openai.com/account/api-keys"
		target="_blank"
		rel="noreferrer"
	>
		Get Key
		<span class="ml-2"><ExternalIcon /></span>
	</a>
</div>
