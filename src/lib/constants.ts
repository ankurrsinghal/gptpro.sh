import type { OpenAIControls } from './types';

export const defaultOpenAIControls: OpenAIControls = {
	model: 'gpt-3.5-turbo',
	max_tokens: 256,
	frequency_penalty: 0,
	presence_penalty: 0,
	temperature: 0.7,
	top_p: 1
};
