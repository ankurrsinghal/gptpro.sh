<script lang="ts">
	import type { ChatConversation } from '$lib/types';
	import HeartIcon from './icons/HeartIcon.svelte';
	import * as timeago from 'timeago.js';

	export let conversation: ChatConversation;
	export let handleConversationClick: (conversation: ChatConversation) => void;
	export let isSelected: boolean;
</script>

<div
	on:click={() => handleConversationClick(conversation)}
	class="relative p-4 border-b border-[var(--border-color)] hover:bg-gray-100 cursor-pointer transition-colors {isSelected
		? 'bg-gray-100'
		: 'bg-white'}"
	aria-hidden
>
	<div class="mb-4 flex justify-between items-center">
		<div class="text-md font-[500] flex">
			{#if conversation.isPinned}
				<div class="mr-2">📌</div>
			{/if}
			{conversation.title}
		</div>
		{#if conversation.updatedAt}
			<div class="text-xs text-gray-600">
				{timeago.format(conversation.updatedAt)}
			</div>
		{/if}
	</div>
	<div class="flex justify-between items-center">
		<div class="text-xs text-[var(--light-text-color)]">
			{conversation.subTitle.length > 50
				? conversation.subTitle.slice(0, 50) + '...'
				: conversation.subTitle}
		</div>
		{#if conversation.isFavorite}
			<HeartIcon fill="red" stroke="none" />
		{/if}
	</div>
</div>
