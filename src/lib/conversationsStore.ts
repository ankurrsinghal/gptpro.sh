import { writable, type Readable, type Writable } from 'svelte/store';
import { GetBotNameByBotId } from './Bots';
import type { Bot, ChatConversation, ChatMessage } from './types';

export function localStorageMiddleware<P, T extends Readable<P>>(readable: T): T {

  // TODO: make a way to unsubscribe it
  const unsub = readable.subscribe(value => {
    try {
      localStorage.setItem('conversations', JSON.stringify(value));
    } catch(e) {
      console.warn(e);
    }
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

	function createNewConversation(botId: string) {
		store.update((conversations) => [
			{
				id: Math.random().toString(),
				messages: [],
				subTitle: 'New conversation',
				title: GetBotNameByBotId(botId),
				isArchived: false,
        botId
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
