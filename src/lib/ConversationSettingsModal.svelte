<script lang="ts">
	import { hotKeyAction } from 'svelte-legos';
	import { fade } from 'svelte/transition';
	import OpenAiControlsForm from './OpenAIControlsForm.svelte';
	import CrossIcon from './icons/CrossIcon.svelte';
	import type { OpenAIControls } from './types';
	import { openAIGlobalControls } from './openAIControlsStore';

	export let onUpdate: (controls: OpenAIControls) => void;
	export let onClose: () => void;
	export let controls: OpenAIControls = $openAIGlobalControls;

	const params = controls;
</script>

<section
	class="fixed inset-0 z-20"
	transition:fade={{ duration: 150 }}
	use:hotKeyAction={{ code: 'Escape', cb: onClose }}
>
	<div
		class="hidden absolute w-full h-full bg-black opacity-75 md:flex"
		on:click={onClose}
		aria-hidden
	/>
	<div class="absolute inset-0 bg-white rounded-md md:inset-x-80 md:inset-y-20">
		<button
			on:click={onClose}
			class="absolute right-4 top-4 border border-black  p-1 rounded-full hover:bg-black hover:text-white cursor-pointer"
		>
			<CrossIcon size="large" />
		</button>
		<div class="flex h-full">
			<OpenAiControlsForm
				subtitle="These settings will only apply to the current selected conversation."
				{onUpdate}
				controls={params}
			/>
		</div>
	</div>
</section>
