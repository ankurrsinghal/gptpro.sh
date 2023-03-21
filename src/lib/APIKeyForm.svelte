<script lang="ts">
	import { onMount } from 'svelte';
	import { hotKeyAction } from 'svelte-legos';
	import { SetKeyIfPossible } from './APIKeyStore';
	import ExternalIcon from './icons/ExternalIcon.svelte';
	import RightIcon from './icons/RightIcon.svelte';

  export let initialValue: string | null = '';

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
  })
</script>

<div class="relative flex items-center w-full">
  <span class="absolute inset-y-0 left-0 my-2 ml-3 w-5 text-gray-400">🔑</span>
  <input
    use:hotKeyAction={{ code: 'Enter', cb: onGetStarted }}
    {disabled}
    bind:value={key}
    bind:this={inputRef}
    type="text"
    placeholder="Enter your OpenAI API key (sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx)"
    class="block w-full rounded-md border border-gray-200 p-3 pl-10 text-sm shadow-lg shadow-gray-900 focus:border-gray-200 focus:outline-none focus:ring-0 disabled:opacity-70 disabled:pointer-events-none"
  />
</div>
{#if isError}
  <div class="mt-4 text-sm mx-auto text-red-500">
    {errorMessage}
  </div>
{/if}
<div class="mx-auto mt-10 flex max-w-fit space-x-4">
  <button
    on:click={onGetStarted}
    {disabled}
    class="text-base h-11 px-4 rounded-md gap-2 bg-white text-black hover:bg-white/90 focus:ring-2 focus:ring-white/20 focus:outline-none focus:bg-white/90 inline-flex items-center justify-center border font-medium"
    >Get Started<span class="ml-2"><RightIcon /></span></button
  >
  <a
    class="flex items-center justify-center space-x-2 rounded-full border border-white text-white  py-2 px-5 shadow-lg transition-all hover:border-slate-400"
    href="https://platform.openai.com/account/api-keys"
    target="_blank"
    rel="noreferrer"
  >
    Get Key<span class="ml-2"><ExternalIcon /></span>
  </a>
</div>