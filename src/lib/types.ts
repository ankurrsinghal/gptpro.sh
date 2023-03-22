export interface Bot {
	id: string;
	name: string;
	prompt: string;
}

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
	botId: string;
	isArchived: boolean;
	isFavorite: boolean;
	isPinned: boolean;
	controls?: OpenAIControls;
}

export type IconSize = 'small' | 'medium' | 'large';

export interface OpenAIControls {
	model: string;
	max_tokens: number;
	frequency_penalty: number;
	presence_penalty: number;
	temperature: number;
	top_p: number;
}
