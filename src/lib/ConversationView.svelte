<script lang="ts">
	import type { ChatConversation } from '$lib/types';
	import HeartIcon from './icons/HeartIcon.svelte';

	export let conversation: ChatConversation;
	export let handleConversationClick: (conversation: ChatConversation) => void;
	export let isSelected: boolean;
</script>

<div
	on:click={() => handleConversationClick(conversation)}
	class="relative px-6 py-4 border-b border-[var(--border-color)] hover:bg-gray-100 cursor-pointer transition-colors {isSelected
		? 'bg-gray-100'
		: 'bg-white'}"
	aria-hidden
>
	<div class="text-md mb-2 font-[500]">{conversation.title}</div>
	<div class="text-xs text-[var(--light-text-color)]">{conversation.subTitle}</div>
	{#if conversation.isFavorite}
		<div class="flex absolute bottom-2 right-2">
			<div class="ml-auto">
				<HeartIcon />
			</div>
		</div>
	{/if}

	{#if conversation.isPinned}
		<div class="flex absolute top-2 right-2">
			<div class="ml-auto">📌</div>
		</div>
	{/if}
</div>
