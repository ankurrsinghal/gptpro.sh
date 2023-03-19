import { writable, type Readable, type Writable } from 'svelte/store';
import type { ChatConversation, ChatMessage } from './types';

export function localStorageMiddleware<P, T extends Readable<P>>(readable: T): T {

  const unsub = readable.subscribe(value => {
    console.log("middleware", value);
  });

  return readable;
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

	function deleteConversation(id: string) {
		store.update(conversations => conversations.filter(conversation => conversation.id !== id));
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
		toggleConversationArchive,
		addMessageToConversation,
		createNewConversation,
    deleteConversation,
	};
}
