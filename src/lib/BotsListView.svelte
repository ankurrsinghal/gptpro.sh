<script lang="ts">
	import { BotsList } from "./Bots";
	import BackIcon from "./icons/BackIcon.svelte";
	import { slideIn } from "./transitions";
	import type { Bot } from "./types";

  export let onBackClick: () => void;
  export let onBotClick: (bot: Bot) => void;

  let botsListFilterText = '';

  const botsList = BotsList;

	$: filteredBotsList = botsList.filter(
		(bot) => bot.name.toLowerCase().indexOf(botsListFilterText.toLowerCase()) !== -1
	);

</script>
<div transition:slideIn class="absolute inset-0 z-30 bg-slate-100 flex flex-col">
  <div class="bg-white p-2 border-b border-black">
    <!-- bots list header -->
    <button
      class="flex border border-black items-center justify-center text-sm rounded-md px-2 py-1"
      on:click={onBackClick}
    >
      <BackIcon />
      <span class="ml-2">Back</span>
    </button>
  </div>
  <div class="bg-slate-100 p-2 border-b border-black">
    <input
      placeholder="🔎 Filter Bots"
      class="text-sm w-full bg-white rounded-md px-2 py-1 border border-black"
      bind:value={botsListFilterText}
    />
  </div>
  <!-- bots list -->
  <div class="flex-1 overflow-auto">
    <div>
      {#each filteredBotsList as bot}
        <button
          on:click={() => onBotClick(bot)}
          class="bg-slate-200 flex flex-col w-full p-4 border-b text-left border-black hover:bg-slate-100 cursor-pointer transition-colors"
        >
          <div>{bot.name}</div>
        </button>
      {/each}
    </div>
  </div>
</div>