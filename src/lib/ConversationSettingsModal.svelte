<script lang="ts">
	import { hotKeyAction } from 'svelte-legos';
	import { fade } from 'svelte/transition';
	import { defaultOpenAIControls } from './constants';
	import GptModelSelect from './GPTModelSelect.svelte';
	import CrossIcon from './icons/CrossIcon.svelte';
	import PrimaryButton from './PrimaryButton.svelte';
	import type { OpenAIControls } from './types';

	export let onUpdate: (controls: OpenAIControls) => void;
	export let onClose: () => void;
	export let controls: OpenAIControls = { ...defaultOpenAIControls };

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
			<div class="p-8 overflow-auto">
				<div class="mb-6">
					<h1 class="text-3xl mb-3">OpenAI Controls</h1>
					<p class="text-gray-500 font-light text-sm">
						These settings will only apply to the current selected conversation.
					</p>
				</div>
				<div class="space-y-4">
					<div>
						<div>GPT Mode:</div>
						<div class="mt-3">
							<GptModelSelect />
						</div>
					</div>
					<div>
						<div>Temperature</div>
						<div class="mt-3 flex items-center space-x-4">
							<input type="range" bind:value={params.temperature} max={1} step={0.01} min={0} />
							<div>{params.temperature}</div>
						</div>
					</div>
					<div>
						<div>Maximum Length</div>
						<div class="mt-3 flex items-center space-x-4">
							<input type="range" bind:value={params.max_tokens} max={2048} step={10} min={1} />
							<div>{params.max_tokens}</div>
						</div>
					</div>
					<div>
						<div>Top P</div>
						<div class="mt-3 flex items-center space-x-4">
							<input type="range" bind:value={params.top_p} max={1} step={0.01} min={0} />
							<div>{params.top_p}</div>
						</div>
					</div>
					<div>
						<div>Frequency Penalty</div>
						<div class="mt-3 flex items-center space-x-4">
							<input
								type="range"
								bind:value={params.frequency_penalty}
								max={2}
								step={0.01}
								min={0}
							/>
							<div>{params.frequency_penalty}</div>
						</div>
					</div>
					<div>
						<div>Presence Penalty</div>
						<div class="mt-3 flex items-center space-x-4">
							<input
								type="range"
								bind:value={params.presence_penalty}
								max={2}
								step={0.01}
								min={0}
							/>
							<div>{params.presence_penalty}</div>
						</div>
					</div>
				</div>
				<div class="mt-6">
					<PrimaryButton on:click={() => onUpdate(params)}>Update</PrimaryButton>
				</div>
			</div>
		</div>
	</div>
</section>
