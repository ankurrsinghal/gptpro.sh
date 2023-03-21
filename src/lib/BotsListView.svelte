<script lang="ts">
	import { BotsList } from './Bots';
	import BackIcon from './icons/BackIcon.svelte';
	import SecondaryButton from './SecondaryButton.svelte';
	import { slideIn } from './transitions';
	import type { Bot } from './types';
	import { onMountFocusRef } from './utils';

	export let onBackClick: () => void;
	export let onBotClick: (bot: Bot) => void;

	let botsListFilterText = '';

	const botsList = BotsList;

	$: filteredBotsList = botsList.filter(
		(bot) => bot.name.toLowerCase().indexOf(botsListFilterText.toLowerCase()) !== -1
	);

	const ref = onMountFocusRef();
</script>

<div transition:slideIn class="absolute inset-0 z-30 bg-slate-100 flex flex-col">
	<div class="bg-white p-2 border-b border-[var(--border-color)]">
		<!-- bots list header -->
		<SecondaryButton on:click={onBackClick}>
			<BackIcon />
			<span class="ml-2">Back</span>
		</SecondaryButton>
	</div>
	<div class="bg-gray-100 p-2 border-b border-[var(--border-color)]">
		<input
			bind:this={ref.current}
			placeholder="🔎 Filter Bots"
			class="text-sm w-full bg-white rounded-md px-2 py-1 border border-[var(--border-color)] focus:border-black outline-none"
			bind:value={botsListFilterText}
		/>
	</div>
	<!-- bots list -->
	<div class="flex-1 overflow-auto">
		<div>
			{#each filteredBotsList as bot}
				<button
					on:click={() => onBotClick(bot)}
					class="text-sm bg-white flex flex-col w-full p-4 border-b text-left border-[var(--border-color)] font-normal hover:bg-gray-100 cursor-pointer transition-colors"
				>
					<div>{bot.name}</div>
				</button>
			{/each}
		</div>
	</div>
</div>
