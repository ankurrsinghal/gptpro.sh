import { readable, writable, type Readable } from 'svelte/store';
import { GetBotNameByBotId } from './Bots';
import type { ChatConversation, ChatMessage } from './types';

export function localStorageMiddleware<P, T extends Readable<P>>(source: T, key: string): T {
	const { subscribe: sourceSubscribe, ...rest } = source;
	const decoratedSubscribe = readable<P>(undefined, (set) => {
		const unsub = sourceSubscribe((value) => {
			try {
				localStorage.setItem(key, JSON.stringify(value));
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

	function deleteConversation(id: string) {
		store.update((conversations) => conversations.filter((conversation) => conversation.id !== id));
	}

	function addMessageToConversation(conversationId: string, message: ChatMessage) {
		//
	}

	function createNewConversation(botId: string) {
		store.update((conversations) => [
			{
				id: Math.random().toString(),
				messages: [],
				subTitle: 'New conversation',
				title: GetBotNameByBotId(botId),
				botId,
        isArchived: false,
        isFavorite: false,
			},
			...conversations
		]);
	}

	return {
		subscribe: store.subscribe,
		update,
		toggleConversationArchive,
    toggleConversationFavorite,
		addMessageToConversation,
		createNewConversation,
		deleteConversation
	};
}
