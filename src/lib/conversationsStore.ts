import { writable } from 'svelte/store';
import type { ChatConversation, ChatMessage } from './types';

export function conversationsStore() {
	const store = writable<ChatConversation[]>([]);

	function update(cb: (conversations: ChatConversation[]) => ChatConversation[]) {
		store.update(cb);
	}

	function archiveConversation(id: string) {
		store.update((conversations) => {
			return conversations.map((conversation) => {
				if (conversation.id === id) {
					return {
						...conversation,
						isArchived: true
					};
				}

				return conversation;
			});
		});
	}

	function deleteConversation(id: string) {
		//
	}

	function addMessageToConversation(conversationId: string, message: ChatMessage) {
		//
	}

	function createNewConversation({ id, subTitle, title }: Partial<ChatConversation> = {}) {
		store.update((conversations) => [
			{
				id: id || Math.random().toString(),
				messages: [],
				subTitle: subTitle || 'New conversation',
				title: title || 'New Conversation',
				isArchived: false
			},
			...conversations
		]);
	}

	return {
		subscribe: store.subscribe,
		update,
		archiveConversation,
		addMessageToConversation,
		createNewConversation
	};
}
