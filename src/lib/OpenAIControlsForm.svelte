<script lang="ts">
	import PrimaryButton from './PrimaryButton.svelte';
	import { SecondaryButtonStyles } from './Styles';
	import type { OpenAIControls } from './types';

	export let onUpdate: (controls: OpenAIControls) => void;
	export let controls: OpenAIControls;
	export let subtitle: string;

	const params = controls;
</script>

<div class="p-8 overflow-auto">
	<div class="mb-6">
		<h1 class="text-3xl mb-3">OpenAI Controls</h1>
		<p class="text-gray-500 font-light text-sm">
			{subtitle}
		</p>
	</div>
	<div class="space-y-4">
		<div>
			<div>GPT Model:</div>
			<div class="mt-3">
				<select bind:value={params.model} class={SecondaryButtonStyles}
					><option value="gpt-3.5-turbo">GPT-3.5-TURBO (Default ChatGPT)</option><option
						value="gpt-3.5-turbo-0301">GPT-3.5-TURBO-0301</option
					><option value="gpt-4">GPT-4 (Limited Beta)</option><option value="gpt-4-0314"
						>GPT-4-0314 (Limited Beta)</option
					><option value="gpt-4-32k">GPT-4-32K (Limited Beta)</option><option value="gpt-4-32k-0314"
						>GPT-4-32K-0314 (Limited Beta)</option
					></select
				>
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
				<input type="range" bind:value={params.frequency_penalty} max={2} step={0.01} min={0} />
				<div>{params.frequency_penalty}</div>
			</div>
		</div>
		<div>
			<div>Presence Penalty</div>
			<div class="mt-3 flex items-center space-x-4">
				<input type="range" bind:value={params.presence_penalty} max={2} step={0.01} min={0} />
				<div>{params.presence_penalty}</div>
			</div>
		</div>
	</div>
	<div class="mt-6">
		<PrimaryButton on:click={() => onUpdate(params)}>Update</PrimaryButton>
	</div>
</div>
