<script lang="ts">
	import { ChatCompletion } from '$lib/GPT';
	import Loader from '$lib/Loader.svelte';
	import { scrollToBottomAction, alertAction, windowSizeStore, messagesStore } from 'svelte-legos';
	import type { Bot, ChatConversation, ChatMessage, OpenAIControls } from '$lib/types';
	import { conversationsStore, localStorageMiddleware } from '$lib/conversationsStore';
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
	import SecondaryButton from './SecondaryButton.svelte';
	import { SecondaryButtonStyles } from './Styles';
	import SliderIcon from './icons/SliderIcon.svelte';
	import ConversationSettingsModal from './ConversationSettingsModal.svelte';
	import { areEqualShallow } from './utils';
	import SettingsIcon from './icons/SettingsIcon.svelte';
	import { openAIGlobalControls } from './openAIControlsStore';

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

	const windowSize = windowSizeStore();
	$: isMobile = $windowSize.width < 768;

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
				currentSelectedConversation.messages.concat([userMessage]),
				currentSelectedConversation.controls || $openAIGlobalControls
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
				.catch((e) => {
					if (e.message === 'Invalid API Key!') {
						messagesStore('Invalid key!');
						isSettingsOpen = true;
					}
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
		if (isMobile) isSidebarVisible = false;
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

	$: pinnedConversations = $conversations.filter((conversation) => conversation.isPinned);

	let isConversationSettingsOpen = false;

	function handleOpenAIControlsUpdateForConversation(controls: OpenAIControls) {
		if (
			currentSelectedConversationId !== null &&
			!areEqualShallow(controls, $openAIGlobalControls)
		) {
			conversations.updateConversationControls(currentSelectedConversationId, controls);
		}

		isConversationSettingsOpen = false;
	}

	$: currentConversationSelectedModel =
		currentSelectedConversation?.controls?.model || $openAIGlobalControls.model;

	function handleModelChange(e: Event) {
		const controls = currentSelectedConversation?.controls || $openAIGlobalControls;
		const model = (e.target as HTMLSelectElement).value;
		if (model && model.trim().length > 0) {
			handleOpenAIControlsUpdateForConversation({ ...controls, model });
		}
	}
</script>

<section class="w-full h-full flex overflow-hidden">
	<div
		class="h-full w-[60px] border-r border-[var(--border-color)] justify-between p-2 hidden md:flex md:flex-col"
	>
		<div>
			<a href="/" class="flex">
				<img src="/logo.svg" alt="GPTPro.sh" />
			</a>
		</div>

		<div>
			<button
				class={SecondaryButtonStyles + ' w-10 h-10 text-xl'}
				on:click={() => (isSettingsOpen = true)}
			>
				<SettingsIcon />
			</button>
		</div>
	</div>

	{#if isSidebarVisible}
		<div
			class="absolute z-10 w-full h-full bg-white overflow-auto border-r border-[var(--border-color)] flex flex-col md:left-0 md:relative md:w-[300px] lg:w-[350px]"
		>
			<!-- sidebar -->
			<div class="bg-white border-b border-[var(--border-color)]">
				<!-- sidebar header -->
				<div class="p-2 flex justify-between">
					<button
						class={SecondaryButtonStyles + ' relative'}
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
								class="absolute z-20 text-md text-left top-full left-0 shadow-lg bg-white p-2 rounded-md min-w-[120px] border border-[var(--border-color)] mt-2"
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
					<button
						class="{SecondaryButtonStyles} md:hidden"
						on:click={() => (isSettingsOpen = true)}
					>
						<SettingsIcon />
					</button>
					{#if currentSelectedConversationId !== null}
						<button
							class="{SecondaryButtonStyles} hidden ml-auto md:flex"
							on:click={() => (isSidebarVisible = false)}
						>
							<LeftIcon />
						</button>
					{/if}
				</div>
			</div>
			<div class="flex-1 overflow-auto">
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
				class="w-10 h-10 rounded-full shadow bg-black flex items-center justify-center absolute right-4 bottom-4 z-10 text-white"
			>
				<PlusIcon />
			</button>

			{#if isBotsListVisible}
				<BotsListView onBackClick={() => (isBotsListVisible = false)} onBotClick={handleBotClick} />
			{/if}
		</div>
	{/if}

	<div class="h-full flex-1">
		{#if currentSelectedConversation}
			<div class="h-full relative flex flex-col">
				<!-- chat container -->
				<div class="bg-white border-b border-[var(--border-color)]">
					<div class="p-2 flex space-x-3 justify-between">
						<div class="flex space-x-3">
							{#if !isSidebarVisible}
								<SecondaryButton on:click={() => (isSidebarVisible = true)}>
									<span class="hidden md:flex"><RightIcon /></span>
									<span class="md:hidden"><LeftIcon /></span>
								</SecondaryButton>
							{/if}
							<SecondaryButton on:click={handlePinClick}>
								<span>📌</span>
								<span class="hidden md:flex ml-2">
									{currentSelectedConversation.isPinned ? 'Unpin' : 'Pin'}
								</span>
							</SecondaryButton>
							<select
								value={currentConversationSelectedModel}
								on:change={handleModelChange}
								class={'hidden md:flex ' + SecondaryButtonStyles}
								><option value="gpt-3.5-turbo">GPT-3.5-TURBO (Default ChatGPT)</option><option
									value="gpt-3.5-turbo-0301">GPT-3.5-TURBO-0301</option
								><option value="gpt-4">GPT-4 (Limited Beta)</option><option value="gpt-4-0314"
									>GPT-4-0314 (Limited Beta)</option
								><option value="gpt-4-32k">GPT-4-32K (Limited Beta)</option><option
									value="gpt-4-32k-0314">GPT-4-32K-0314 (Limited Beta)</option
								></select
							>
							<SecondaryButton on:click={() => (isConversationSettingsOpen = true)}>
								<SliderIcon />
								<span class="hidden md:flex ml-2">Settings</span>
							</SecondaryButton>
						</div>
						<div class="flex space-x-3">
							<button
								class={SecondaryButtonStyles}
								use:alertAction={{
									title: 'Are you sure?',
									description: "You won't be able to recover this conversation!",
									onOk: handleDeleteClick
								}}
							>
								<DeleteIcon />
								<span class="hidden md:flex ml-2">Delete</span>
							</button>
							<SecondaryButton on:click={handleArchiveClick}>
								<ArchiveIcon />
								<span class="hidden md:flex ml-2">
									{currentSelectedConversation.isArchived ? 'UnArchive' : 'Archive'}
								</span>
							</SecondaryButton>
							<SecondaryButton on:click={handleFavoriteClick}>
								<HeartIcon />
								<span class="hidden md:flex ml-2">
									{currentSelectedConversation.isFavorite ? 'Unlike' : 'Like'}
								</span>
							</SecondaryButton>
						</div>
					</div>
				</div>

				<div class="overflow-auto bg-white relative flex-1" use:scrollToBottomAction>
					<div class="p-8 space-y-10 text-md min-w-full flex flex-col">
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

{#if isConversationSettingsOpen}
	<ConversationSettingsModal
		onUpdate={handleOpenAIControlsUpdateForConversation}
		controls={currentSelectedConversation?.controls}
		onClose={() => (isConversationSettingsOpen = false)}
	/>
{/if}
