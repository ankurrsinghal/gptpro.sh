<script lang="ts">
	import { ChatCompletion, type Message } from '$lib/GPT';
	import Loader from '$lib/Loader.svelte';
	import { writable } from 'svelte/store';

	const messages = writable<Message[]>([]);
	let isLoading: boolean = false;
	let currentMessagePrompt = '';

	let inputRef: HTMLInputElement;

	$: currentMessage = currentMessagePrompt.trim();

	$: if ($messages.length > 0) {
		localStorage.setItem('messages', JSON.stringify($messages));
	}

	$: {
		try {
			const messagesStr = localStorage.getItem('messages');
			if (messagesStr !== null) messages.set(JSON.parse(messagesStr));
		} catch (e) {
			console.error(e);
		}
	}

	let apiKey: string | null = '';

	$: {
		try {
			apiKey = localStorage.getItem('apiKey');
		} catch (e) {
			console.warn('Could not read API key', e);
		}
	}

	function handleSend() {
		if (!apiKey || typeof apiKey !== 'string' || apiKey.trim().length === 0) {
			console.warn('OpenAI API key not defined');
			return;
		}
		if (currentMessage.length > 0) {
			const userMessage = {
				id: Date.now(),
				content: currentMessage,
				from: 'user'
			} as Message;

			isLoading = true;
			ChatCompletion(apiKey, $messages.concat([userMessage]))
				.then((res: any) => {
					// setData(res);
					const {
						choices: [
							{
								message: { content }
							}
						]
					} = res;
					messages.update((messages) => [
						...messages,
						userMessage,
						{
							id: Date.now() + 1,
							content,
							from: 'assistant'
						}
					]);

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
</script>

<section>
	<div>
		<!-- sidebar -->
	</div>
	<div>
		<!-- chat container -->
		<div class="flex-1 overflow-auto bg-gray-100 relative">
			<div class="max-w-[900px] mx-auto relative pb-[64px]">
				<div class="p-8 space-y-6 text-sm min-w-full">
					{#each $messages as message}
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
					<Loader visible={isLoading} />
				</div>
			</div>

			<div
				class="max-w-[900px] h-[64px] w-full left-1/2 transform -translate-x-1/2 fixed bg-white bottom-2 space-x-5 text-sm mx-auto p-4 shadow rounded-md flex items-center justify-center"
			>
				<input
					disabled={isLoading}
					bind:this={inputRef}
					bind:value={currentMessagePrompt}
					on:keydown={(e) => e.key === 'Enter' && handleSend()}
					class="w-full border-2 border-black px-2 py-1 rounded-md outline-none bg-white text-black focus-within:border-blue-700 disabled:opacity-30 disabled:pointer-events-none"
				/>
				<button
					class="px-4 py-1 bg-slate-500 rounded-md text-white disabled:opacity-30 disabled:pointer-events-none"
					on:click={handleSend}
					disabled={isLoading}
				>
					Send
				</button>
			</div>
		</div>
	</div>
</section>

<style>
</style>
