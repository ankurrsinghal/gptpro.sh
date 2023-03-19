export interface ChatMessage {
	from: 'user' | 'assistant';
	content: string;
	id: string;
}

export interface ChatConversation {
  id: string;
  title: string;
  subTitle: string;
  messages: ChatMessage[];
}