<script lang="ts">
	import { ChatCompletion } from '$lib/GPT';
	import Loader from '$lib/Loader.svelte';
	import { scrollToBottomAction } from 'svelte-legos';
	import type { ChatConversation, ChatMessage } from '$lib/types';
	import { onMount } from 'svelte';
	import { conversationsStore } from '$lib/conversationsStore';
	import Conversation from './Conversation.svelte';
	import SettingsIcon from '$lib/icons/SettingsIcon.svelte';
	import PlusIcon from '$lib/icons/PlusIcon.svelte';
	import SendIcon from '$lib/icons/SendIcon.svelte';

	const conversations = conversationsStore();
	let currentSelectedConversationId = '';

	let isLoading: boolean = false;
	let currentMessagePrompt = '';

	let inputRef: HTMLInputElement;

	$: currentMessage = currentMessagePrompt.trim();
	$: currentSelectedConversation = $conversations.find(
		(conversation) => conversation.id === currentSelectedConversationId
	);

	let apiKey: string | null = '';

	onMount(() => {
		try {
			apiKey = localStorage.getItem('apiKey');
		} catch (e) {
			console.warn('Could not read API key', e);
		}

		try {
			const conversationJSONStr = localStorage.getItem('conversations');
			if (conversationJSONStr !== null) {
				const savedConversations = JSON.parse(conversationJSONStr) as ChatConversation[];
				if (savedConversations.length > 0) {
					conversations.update(() => savedConversations);
					currentSelectedConversationId = savedConversations[0].id;
				} else {
					const id = Math.random().toString();
					conversations.update(() => [
						{
							id,
							messages: [],
							subTitle: 'Subtitle',
							title: 'Title'
						}
					]);
					currentSelectedConversationId = id;
				}
			} else {
				const id = Math.random().toString();
				conversations.update(() => [
					{
						id,
						messages: [],
						subTitle: 'Subtitle',
						title: 'Title'
					}
				]);
				currentSelectedConversationId = id;
			}
		} catch (e) {
			console.error(e);
			const id = Math.random().toString();
			conversations.update(() => [
				{
					id,
					messages: [],
					subTitle: 'Subtitle',
					title: 'Title'
				}
			]);
			currentSelectedConversationId = id;
		}
	});

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
			ChatCompletion(apiKey, currentSelectedConversation.messages.concat([userMessage]))
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
										title: userMessage.content,
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

	function handleCreateConversationClick() {
		conversations.update((conversations) => [
			{
				id: Math.random().toString(),
				messages: [],
				subTitle: 'New conversation',
				title: 'New Conversation'
			},
			...conversations
		]);
	}

	function handleConversationClick(conversation: ChatConversation) {
		currentSelectedConversationId = conversation.id;
	}

	$: {
		if ($conversations.length > 0) {
			localStorage.setItem('conversations', JSON.stringify($conversations));
		}
	}

	$: console.log(currentSelectedConversation)
</script>

<section class="w-screen h-screen flex">
	<div class="h-full w-[300px] bg-gray-100 relative overflow-auto border-r border-black">
		<!-- sidebar -->
		<div>
			<!-- sidebar header -->
			<div class="p-2">
				<div class="cursor-pointer">
					<SettingsIcon />
				</div>
			</div>
			<div>
				<input class="p-2 w-full" />
			</div>
		</div>
		<div>
			{#each $conversations as conversation}
				<Conversation
					conversation={conversation}
					handleConversationClick={handleConversationClick}
					isSelected={currentSelectedConversationId === conversation.id}
				/>
			{/each}
		</div>
		<button
			on:click={handleCreateConversationClick}
			class="w-10 h-10 rounded-full bg-black flex items-center justify-center absolute right-4 bottom-4 z-10 text-white"
		>
			<PlusIcon />
		</button>
	</div>
	<div class="h-full relative flex-1 flex flex-col">
		<!-- chat container -->
		<div class="overflow-auto bg-gray-100 relative max-h-full flex-1" use:scrollToBottomAction>
			<div class="p-8 space-y-6 text-sm min-w-full">
				{#if currentSelectedConversation}
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
								message.from === 'user'
									? 'bg-white text-black ml-auto'
									: 'bg-blue-100 mr-auto text-black'
							].join(' ')}
						>
							{message.content}
						</div>
					{/each}
				{/if}
				<Loader visible={isLoading} />
			</div>
		</div>

		<div
			class="w-full bg-white bottom-2 space-x-5 text-sm mx-auto p-4 shadow rounded-md flex items-center justify-center"
		>
			<input
				disabled={isLoading}
				bind:this={inputRef}
				bind:value={currentMessagePrompt}
				on:keydown={(e) => e.key === 'Enter' && handleSend()}
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
</section>

<!-- <section>
	preferences
</section> -->

<style>
</style>
