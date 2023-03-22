import { readable, writable, type Readable } from 'svelte/store';
import { GetBotNameByBotId } from './Bots';
import type { ChatConversation, ChatMessage, OpenAIControls } from './types';
import { v4 as uuidv4 } from 'uuid';

export function localStorageMiddleware<P, T extends Readable<P>>(source: T, key: string): T {
	const { subscribe: sourceSubscribe, ...rest } = source;
	const decoratedSubscribe = readable<P>(undefined, (set) => {
		const unsub = sourceSubscribe((value) => {
			try {
				if (typeof value === 'string' || typeof value === 'number') {
					localStorage.setItem(key, value.toString());
				} else if (typeof value === 'object') {
					localStorage.setItem(key, JSON.stringify(value));
				} else {
					throw new Error('Unknown type!');
				}
			} catch (e) {
				console.warn(e);
			}
			set(value);
		});

		return unsub;
	});

	return { subscribe: decoratedSubscribe.subscribe, ...rest } as T;
}

export function conversationsStore() {
	let initialConversations: ChatConversation[] = [];
	try {
		const conversationJSONStr = localStorage.getItem('conversations');
		if (conversationJSONStr !== null) {
			const savedConversations = JSON.parse(conversationJSONStr) as ChatConversation[];
			if (savedConversations.length > 0) {
				initialConversations = savedConversations;
			}
		}
	} catch (e) {
		console.error(e);
	}

	const store = writable<ChatConversation[]>(initialConversations);

	function update(cb: (conversations: ChatConversation[]) => ChatConversation[]) {
		store.update(cb);
	}

	function toggleConversationArchive(id: string, isArchived?: boolean) {
		store.update((conversations) => {
			return conversations.map((conversation) => {
				if (conversation.id === id) {
					return {
						...conversation,
						isArchived: isArchived === undefined ? !conversation.isArchived : isArchived
					};
				}

				return conversation;
			});
		});
	}

	function toggleConversationFavorite(id: string, isFavorite?: boolean) {
		store.update((conversations) => {
			return conversations.map((conversation) => {
				if (conversation.id === id) {
					return {
						...conversation,
						isFavorite: isFavorite === undefined ? !conversation.isFavorite : isFavorite
					};
				}

				return conversation;
			});
		});
	}

	function toggleConversationPinned(id: string, isPinned?: boolean) {
		store.update((conversations) => {
			return conversations.map((conversation) => {
				if (conversation.id === id) {
					return {
						...conversation,
						isPinned: isPinned === undefined ? !conversation.isPinned : isPinned
					};
				}

				return conversation;
			});
		});
	}

	function updateConversationControls(id: string, controls: OpenAIControls) {
		store.update((conversations) => {
			return conversations.map((conversation) => {
				if (conversation.id === id) {
					return {
						...conversation,
						controls
					};
				}

				return conversation;
			});
		});
	}

	function deleteConversation(id: string) {
		store.update((conversations) => conversations.filter((conversation) => conversation.id !== id));
	}

	function addMessageToConversation(conversationId: string, message: ChatMessage) {
		//
	}

	function createNewConversation(botId: string) {
		const id = uuidv4();
		store.update((conversations) => [
			{
				id,
				messages: [],
				subTitle: 'New conversation',
				title: GetBotNameByBotId(botId),
				botId,
				isArchived: false,
				isFavorite: false,
				isPinned: false,
				createdAt: Date.now(),
				updatedAt: Date.now()
			},
			...conversations
		]);
		return id;
	}

	return {
		subscribe: store.subscribe,
		update,
		toggleConversationArchive,
		toggleConversationFavorite,
		toggleConversationPinned,
		addMessageToConversation,
		createNewConversation,
		deleteConversation,
		updateConversationControls
	};
}
