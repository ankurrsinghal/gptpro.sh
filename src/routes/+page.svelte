<script lang="ts">
	import { ChatCompletion } from '$lib/GPT';
	import Loader from '$lib/Loader.svelte';
	import {
		scrollToBottomAction,
		hotKeyAction,
		textareaAutosizeAction,
		alertAction
	} from 'svelte-legos';
	import type { Bot, ChatConversation, ChatMessage } from '$lib/types';
	import { onMount } from 'svelte';
	import { conversationsStore, localStorageMiddleware } from '$lib/conversationsStore';
	import Conversation from './Conversation.svelte';
	import SettingsIcon from '$lib/icons/SettingsIcon.svelte';
	import PlusIcon from '$lib/icons/PlusIcon.svelte';
	import SendIcon from '$lib/icons/SendIcon.svelte';
	import { APIKeyStore } from '$lib/APIKeyStore';
	import CrossIcon from '$lib/icons/CrossIcon.svelte';
	import { fade } from 'svelte/transition';
	import DeleteIcon from '$lib/icons/DeleteIcon.svelte';
	import ArchiveIcon from '$lib/icons/ArchiveIcon.svelte';
	import FunnelIcon from '$lib/icons/FunnelIcon.svelte';
	import * as Popper from '@popperjs/core';
	import { filtersStore } from '$lib/filterStore';
	import { BotsList } from '$lib/Bots';
	import BackIcon from '$lib/icons/BackIcon.svelte';
	import LeftIcon from '$lib/icons/LeftIcon.svelte';
	import RightIcon from '$lib/icons/RightIcon.svelte';

	const conversations = localStorageMiddleware(conversationsStore());
	let currentSelectedConversationId: string | null = null;

	let isLoading: boolean = false;
	let currentMessagePrompt = '';

	let inputRef: HTMLTextAreaElement;

	let isSettingsOpen = false;

	$: currentMessage = currentMessagePrompt.trim();
	$: currentSelectedConversation = $conversations.find(
		(conversation) => conversation.id === currentSelectedConversationId
	);

	const apiKey = APIKeyStore();
	const { isArchived: isArchivedFilter } = filtersStore();

	function handleSend() {
		if (!$apiKey || typeof $apiKey !== 'string' || $apiKey.trim().length === 0) {
			console.warn('OpenAI API key not defined');
			return;
		}
		if (currentMessage.length > 0 && currentSelectedConversation !== undefined) {
			const userMessage = {
				id: Math.random().toString(),
				content: currentMessage,
				from: 'user'
			} as ChatMessage;

			isLoading = true;
			ChatCompletion(
				$apiKey,
				currentSelectedConversation.botId,
				currentSelectedConversation.messages.concat([userMessage])
			)
				.then((res: any) => {
					// setData(res);
					const {
						choices: [
							{
								message: { content }
							}
						]
					} = res;

					conversations.update((conversations) => {
						return conversations.map((conversation) => {
							if (conversation.id === currentSelectedConversationId) {
								if (conversation.messages.length === 0) {
									return {
										...conversation,
										subTitle: userMessage.content,
										messages: [
											...conversation.messages,
											userMessage,
											{
												id: Math.random().toString(),
												content,
												from: 'assistant'
											}
										]
									};
								} else {
									return {
										...conversation,
										messages: [
											...conversation.messages,
											userMessage,
											{
												id: Math.random().toString(),
												content,
												from: 'assistant'
											}
										]
									};
								}
							}

							return conversation;
						});
					});

					currentMessagePrompt = '';
				})
				.finally(() => {
					isLoading = false;
					setTimeout(() => {
						inputRef.focus();
					}, 1);
				});
		}
	}

	function handleConversationClick(conversation: ChatConversation) {
		currentSelectedConversationId = conversation.id;
	}

	function handleDeleteClick() {
		if (currentSelectedConversationId !== null) {
			conversations.deleteConversation(currentSelectedConversationId);
		}

		currentSelectedConversationId = null;
	}

	function handleArchiveClick() {
		if (currentSelectedConversationId !== null) {
			conversations.toggleConversationArchive(currentSelectedConversationId);
		}

		currentSelectedConversationId = null;
	}

	let filterRef: HTMLElement;
	let filterPopperRef: HTMLElement;
	let isFilterOpen = false;
	let filterPopperInstance: Popper.Instance | null = null;
	function handleFilterClick(e: MouseEvent) {
		isFilterOpen = !isFilterOpen;
		if (filterPopperInstance === null) {
			filterPopperInstance = Popper.createPopper(filterRef, filterPopperRef, {
				placement: 'bottom',
				modifiers: [
					{
						name: 'offset',
						options: {
							offset: [0, 8]
						}
					}
				]
			});
		}

		filterPopperInstance.update();
	}

	$: filteredConversations = $conversations.filter(
		(conversation) => conversation.isArchived === $isArchivedFilter
	);

	let isBotsListVisible = false;

	function handleBotClick(bot: Bot) {
		conversations.createNewConversation(bot.id);
		isBotsListVisible = false;
	}

	const botsList = BotsList;
	let botsListFilterText = '';

	$: filteredBotsList = botsList.filter(
		(bot) => bot.name.toLowerCase().indexOf(botsListFilterText.toLowerCase()) !== -1
	);

	let isSidebarVisible = true;
</script>

<section
	class="w-screen h-screen flex"
	use:hotKeyAction={{ code: 'Escape', cb: () => (isSettingsOpen = false) }}
>
	{#if isSidebarVisible}
		<div class="h-full w-[300px] bg-gray-100 relative overflow-auto border-r border-black">
			<!-- sidebar -->
			<div class="bg-white border-b border-black">
				<!-- sidebar header -->
				<div class="p-2 flex">
					<button
						class="flex border border-black items-center justify-center text-sm rounded-md px-2 py-1"
						on:click={() => (isSettingsOpen = true)}
					>
						<SettingsIcon />
						<span class="ml-2">Settings</span>
					</button>
					<button
						class="ml-auto flex border border-black items-center justify-center text-sm rounded-md px-2 py-1"
						on:click={handleFilterClick}
						bind:this={filterRef}
					>
						<FunnelIcon />
						<span class="ml-2">Filters</span>
					</button>
					<button
						class="ml-auto flex border border-black items-center justify-center text-sm rounded-md px-2 py-1"
						on:click={() => (isSidebarVisible = false)}
					>
						<LeftIcon />
					</button>
				</div>
				<!-- <div>
					<input class="p-2 w-full" />
				</div> -->
			</div>
			<div>
				{#each filteredConversations as conversation}
					<Conversation
						{conversation}
						{handleConversationClick}
						isSelected={currentSelectedConversationId === conversation.id}
					/>
				{/each}
			</div>
			<button
				on:click={() => (isBotsListVisible = true)}
				class="w-10 h-10 rounded-full bg-black flex items-center justify-center absolute right-4 bottom-4 z-10 text-white"
			>
				<PlusIcon />
			</button>

			{#if isBotsListVisible}
				<div class="absolute inset-0 z-30 bg-slate-100 flex flex-col">
					<div class="bg-white p-2 border-b border-black">
						<!-- bots list header -->
						<button
							class="flex border border-black items-center justify-center text-sm rounded-md px-2 py-1"
							on:click={() => (isBotsListVisible = false)}
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
									on:click={() => handleBotClick(bot)}
									class="bg-slate-200 flex w-full p-4 border-b text-left border-black hover:bg-slate-100 cursor-pointer transition-colors"
								>
									{bot.name}
								</button>
							{/each}
						</div>
					</div>
				</div>
			{/if}
		</div>
	{/if}

	<div class="h-full flex-1">
		{#if currentSelectedConversation}
			<div class="h-full relative flex flex-col">
				<!-- chat container -->
				<div class="bg-white border-b border-black">
					<div class="p-2 flex space-x-3">
						{#if !isSidebarVisible}
							<button
								class="flex border border-black items-center justify-center text-sm rounded-md px-2 py-1"
								on:click={() => (isSidebarVisible = true)}
							>
								<RightIcon />
							</button>
						{/if}
						<button
							class="flex border border-black items-center justify-center text-sm rounded-md px-2 py-1"
							use:alertAction={{
								title: 'Are you sure?',
								description: "You won't be able to recover this conversation!",
								onOk: handleDeleteClick
							}}
						>
							<DeleteIcon />
							<span class="ml-2">Delete</span>
						</button>
						<button
							class="flex border border-black items-center justify-center text-sm rounded-md px-2 py-1"
							on:click={handleArchiveClick}
						>
							<ArchiveIcon />
							<span class="ml-2"
								>{currentSelectedConversation.isArchived ? 'UnArchive' : 'Archive'}</span
							>
						</button>
					</div>
				</div>

				<div class="overflow-auto bg-gray-100 relative max-h-full flex-1" use:scrollToBottomAction>
					<div class="p-8 space-y-6 text-md min-w-full">
						{#each currentSelectedConversation.messages as message}
							<div
								class={[
									'relative',
									'max-w-[85%] lg:max-w-[70%]',
									'whitespace-pre-wrap',
									'px-3 py-2',
									'rounded-md',
									'shadow-md',
									'leading-relaxed',
									'border border-gray-300',
									message.from === 'user'
										? 'bg-cyan-100 text-black ml-auto'
										: 'bg-white mr-auto text-black'
								].join(' ')}
							>
								{message.content}
							</div>
						{/each}
						<Loader visible={isLoading} />
					</div>
				</div>

				<div
					class="w-full bg-white bottom-2 space-x-5 text-sm mx-auto p-4 shadow rounded-md flex items-center justify-center"
				>
					<textarea
						use:textareaAutosizeAction
						use:hotKeyAction={{ code: 'Enter', cb: () => handleSend() }}
						disabled={isLoading}
						bind:this={inputRef}
						bind:value={currentMessagePrompt}
						class="w-full border-2 border-black px-2 py-1 rounded-md outline-none bg-white text-black focus-within:border-blue-700 disabled:opacity-30 disabled:pointer-events-none"
					/>
					<button
						class="flex w-8 h-8 rounded-full bg-black items-center justify-center text-white font-mono disabled:opacity-30 disabled:pointer-events-none"
						on:click={handleSend}
						disabled={isLoading}
					>
						<SendIcon tailwindClass="w-4 h-4" />
					</button>
				</div>
			</div>
		{/if}
	</div>
</section>

{#if isSettingsOpen}
	<section class="fixed inset-0 z-20" transition:fade={{ duration: 150 }}>
		<div class="absolute w-full h-full bg-black opacity-75" />
		<div class="absolute inset-4 bg-white rounded-md p-4">
			<button
				on:click={() => (isSettingsOpen = false)}
				class="absolute right-4 top-4 border border-black  p-1 rounded-full hover:bg-black hover:text-white cursor-pointer"
			>
				<CrossIcon />
			</button>
			<div>
				<label class="mr-4" for="api-key">OpenAI API Key: </label>
				<input
					id="api-key"
					class="p-2 bg-slate-100 rounded-md border border-black min-w-[500px]"
					bind:value={$apiKey}
				/>
			</div>
		</div>
	</section>
{/if}

<div
	bind:this={filterPopperRef}
	class="shadow bg-white p-2 rounded-md min-w-[200px] border border-black mt-2 {isFilterOpen
		? ''
		: 'hidden'}"
>
	<div>Filters</div>
	<div>
		<div>
			<label for="is-archived">Archived</label>
			<input type="checkbox" id="is-archived" bind:checked={$isArchivedFilter} />
		</div>
	</div>
</div>
