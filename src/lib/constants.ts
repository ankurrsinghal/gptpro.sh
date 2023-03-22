import type { OpenAIControls } from './types';

export const defaultOpenAIControls: OpenAIControls = {
	max_tokens: 256,
	frequency_penalty: 0,
	presence_penalty: 0,
	temperature: 0.7,
	top_p: 1
};
