<script lang="ts">
	import { ChatCompletion } from '$lib/GPT';
	import Loader from '$lib/Loader.svelte';
	import { scrollToBottomAction, hotKeyAction, alertAction } from 'svelte-legos';
	import type { Bot, ChatConversation, ChatMessage } from '$lib/types';
	import {
		conversationsStore,
		localStorageMiddleware,
	} from '$lib/conversationsStore';
	import ConversationView from '../lib/ConversationView.svelte';
	import PlusIcon from '$lib/icons/PlusIcon.svelte';
	import DeleteIcon from '$lib/icons/DeleteIcon.svelte';
	import ArchiveIcon from '$lib/icons/ArchiveIcon.svelte';
	import FunnelIcon from '$lib/icons/FunnelIcon.svelte';
	import { filtersStore } from '$lib/filterStore';
	import LeftIcon from '$lib/icons/LeftIcon.svelte';
	import RightIcon from '$lib/icons/RightIcon.svelte';
	import MessageView from '$lib/MessageView.svelte';
	import MessageInputBar from '$lib/MessageInputBar.svelte';
	import { writable } from 'svelte/store';
	import HeartIcon from './icons/HeartIcon.svelte';
	import SettingsModal from './SettingsModal.svelte';
	import BotsListView from './BotsListView.svelte';

	export let apiKey: string;
	const conversations = localStorageMiddleware(conversationsStore(), 'conversations');

	let currentSelectedConversationId: string | null = null;

	let isLoading: boolean = false;
	const currentMessagePrompt = writable('');
	const inputRef = writable<HTMLTextAreaElement | null>(null);

	let isSettingsOpen = false;

	$: currentMessage = $currentMessagePrompt.trim();
	$: currentSelectedConversation = $conversations.find(
		(conversation) => conversation.id === currentSelectedConversationId
	);

	const { isArchived: isArchivedFilter, isFavorite: isFavoriteFilter } = filtersStore();

	function handleSend() {
		if (!apiKey || typeof apiKey !== 'string' || apiKey.trim().length === 0) {
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
				apiKey,
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

					currentMessagePrompt.set('');
				})
				.finally(() => {
					isLoading = false;
					setTimeout(() => {
						$inputRef?.focus();
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

	function handleFavoriteClick() {
		if (currentSelectedConversationId !== null) {
			conversations.toggleConversationFavorite(currentSelectedConversationId);
		}
	}

	function handlePinClick() {
		if (currentSelectedConversationId !== null) {
			conversations.toggleConversationPinned(currentSelectedConversationId);
		}
	}

	let filterRef: HTMLElement;
	let isFilterOpen = false;

	function clickOutsideAction<T extends Element>(
		node: T,
		{ cb, trigger }: { cb: Function; trigger?: HTMLElement }
	) {
		const handleClick = (event: MouseEvent) => {
			const { target } = event;
			if (target !== null && !node.contains(target as Node)) {
				if (trigger) {
					if (!trigger.contains(target as Node)) {
						cb();
					}
				} else {
					cb();
				}
			}
		};

		document.addEventListener('click', handleClick, true);

		return {
			destroy() {
				document.removeEventListener('click', handleClick, true);
			}
		};
	}

	function handleFilterClick() {
		isFilterOpen = !isFilterOpen;
	}

	function handleFilterClickOutside() {
		isFilterOpen = false;
	}

	$: filteredConversations = $conversations.filter((conversation) => {
		const isArchived = $isArchivedFilter;
		const isFavorite = $isFavoriteFilter;

		let check = conversation.isArchived === isArchived;

		if (isFavorite === true) {
			check = check && conversation.isFavorite;
		}

		return check && !conversation.isPinned;
	});

	let isBotsListVisible = false;

	function handleBotClick(bot: Bot) {
		conversations.createNewConversation(bot.id);
		isBotsListVisible = false;
	}

	let isSidebarVisible = true;
	
  $: pinnedConversations = $conversations.filter(conversation => conversation.isPinned);
</script>

<section
	class="w-screen h-screen flex"
	use:hotKeyAction={{ code: 'Escape', cb: () => (isSettingsOpen = false) }}
>
	<div class="h-full w-[60px] border-r border-black flex flex-col justify-between p-2">
		<div>
			<a href="/" class="flex">
				<img class="shadow" src="/logo.svg" alt="GPTPro.sh" />
			</a>
		</div>

		<div>
			<button class="w-10 h-10 rounded-md bg-white border border-black" on:click={() => (isSettingsOpen = true)}>
				🔑
			</button>
		</div>
	</div>

	{#if isSidebarVisible}
		<div class="h-full w-[300px] bg-gray-100 relative overflow-auto border-r border-black">
			<!-- sidebar -->
			<div class="bg-white border-b border-black">
				<!-- sidebar header -->
				<div class="p-2 flex">
					<button
						class="flex border mr-auto border-black items-center justify-center text-sm rounded-md px-2 py-1 relative"
						on:click={handleFilterClick}
						bind:this={filterRef}
					>
						<FunnelIcon />
						<span class="ml-2">Filters</span>
						{#if isFilterOpen}
							<div
								aria-hidden
								on:click={(e) => {
									e.stopPropagation();
								}}
								use:clickOutsideAction={{ cb: handleFilterClickOutside, trigger: filterRef }}
								class="absolute z-20 text-md text-left top-full left-0 shadow-lg bg-white p-2 rounded-md min-w-[120px] border border-black mt-2"
							>
								<div class="space-y-2">
									<div class="flex items-center space-x-2">
										<label for="is-archived" class="cursor-pointer">Archived</label>
										<input type="checkbox" id="is-archived" bind:checked={$isArchivedFilter} />
									</div>
									<div class="flex items-center space-x-2">
										<label for="is-favorite" class="cursor-pointer">Favorite</label>
										<input type="checkbox" id="is-favorite" bind:checked={$isFavoriteFilter} />
									</div>
								</div>
							</div>
						{/if}
					</button>
					{#if currentSelectedConversationId !== null}
						<button
							class="ml-auto flex border border-black items-center justify-center text-sm rounded-md px-2 py-1"
							on:click={() => (isSidebarVisible = false)}
						>
							<LeftIcon />
						</button>
					{/if}
				</div>
				<!-- <div>
					<input class="p-2 w-full" />
				</div> -->
			</div>
			<div>
				{#each pinnedConversations as conversation}
					<ConversationView
						{conversation}
						{handleConversationClick}
						isSelected={currentSelectedConversationId === conversation.id}
					/>
				{/each}
				{#each filteredConversations as conversation}
					<ConversationView
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
				<BotsListView
					onBackClick={() => (isBotsListVisible = false)}
					onBotClick={handleBotClick}
				/>
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
							on:click={handlePinClick}
						>
							<span>📌</span>
							<span class="ml-2"
								>{currentSelectedConversation.isPinned ? 'Unpin' : 'Pin'}</span
							>
						</button>
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
						<button
							class="flex border border-black items-center justify-center text-sm rounded-md px-2 py-1"
							on:click={handleFavoriteClick}
						>
							<HeartIcon />
							<span class="ml-2">{currentSelectedConversation.isFavorite ? 'Unlike' : 'Like'}</span>
						</button>
					</div>
				</div>

				<div class="overflow-auto bg-gray-100 relative max-h-full flex-1" use:scrollToBottomAction>
					<div class="p-8 space-y-6 text-md min-w-full flex flex-col">
						{#each currentSelectedConversation.messages as message}
							<MessageView {message} />
						{/each}
						<Loader visible={isLoading} />
					</div>
				</div>
				<MessageInputBar
					disabled={isLoading}
					onSend={handleSend}
					value={currentMessagePrompt}
					ref={inputRef}
				/>
			</div>
		{/if}
	</div>
</section>

{#if isSettingsOpen}
	<SettingsModal onClose={() => (isSettingsOpen = false)} />
{/if}
