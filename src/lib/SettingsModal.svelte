<script lang="ts">
	import { hotKeyAction } from 'svelte-legos';
	import { fade } from 'svelte/transition';
	import ApiKeyForm from './APIKeyForm.svelte';
	import { APIKeyStore } from './APIKeyStore';
	import CrossIcon from './icons/CrossIcon.svelte';
	import OpenAiControlsForm from './OpenAIControlsForm.svelte';
	import { openAIGlobalControls } from './openAIControlsStore';
	import type { OpenAIControls } from './types';

	export let onClose: () => void;

	let currentActiveTab = 0;

	function handleOpenAIControlsUpdate(params: OpenAIControls) {
		openAIGlobalControls.set(params);
		onClose();
	}
</script>

<section
	class="fixed inset-0 z-20"
	transition:fade={{ duration: 150 }}
	use:hotKeyAction={{ code: 'Escape', cb: onClose }}
>
	<div class="hidden absolute w-full h-full bg-black opacity-75 md:flex" />
	<div class="absolute inset-0 bg-white rounded-md p-4 flex flex-col md:inset-4 md:flex-row">
		<button
			on:click={onClose}
			class="absolute right-4 top-4 border border-black  p-1 rounded-full hover:bg-black hover:text-white cursor-pointer"
		>
			<CrossIcon size="large" />
		</button>
		<div
			class="flex space-x-4 border-b py-4 md:space-x-0 items-start justify-start md:h-full md:flex-col md:space-y-4 text-xl px-4 md:border-r md:border-b-0 border-[var(--border-color)] text-gray-300"
		>
			<button
				on:click={() => (currentActiveTab = 0)}
				class={currentActiveTab === 0 ? 'text-black' : ''}>Key</button
			>
			<button
				on:click={() => (currentActiveTab = 1)}
				class={currentActiveTab === 1 ? 'text-black' : ''}>Controls</button
			>
		</div>
		{#if currentActiveTab === 0}
			<div class="flex flex-1 items-center justify-center h-full">
				<div class="w-full lg:w-[50%]">
					<h1 class="text-3xl mb-4 text-center">Update your key</h1>
					<ApiKeyForm initialValue={$APIKeyStore} CTALabel="Save" onDone={onClose} />
				</div>
			</div>
		{/if}
		{#if currentActiveTab === 1}
			<div class="h-full overflow-auto">
				<OpenAiControlsForm
					onUpdate={handleOpenAIControlsUpdate}
					controls={$openAIGlobalControls}
				/>
			</div>
		{/if}
	</div>
</section>
