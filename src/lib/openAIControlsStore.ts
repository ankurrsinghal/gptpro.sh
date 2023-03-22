import { writable } from 'svelte/store';
import { localStorageMiddleware } from './conversationsStore';
import type { OpenAIControls } from './types';
import { isClient } from './utils';

let initialValue: OpenAIControls = {
	model: 'gpt-3.5-turbo',
	max_tokens: 256,
	frequency_penalty: 0,
	presence_penalty: 0,
	temperature: 0.7,
	top_p: 1
};

if (isClient) {
	try {
		const jsonStr = localStorage.getItem('conversations');
		if (jsonStr !== null) {
			const openAIControlsFromLocalStorage = JSON.parse(jsonStr) as OpenAIControls;
			if ('model' in openAIControlsFromLocalStorage) {
				initialValue = { ...initialValue, ...openAIControlsFromLocalStorage };
			}
		}
	} catch (e) {
		console.error(e);
	}
}

export const openAIGlobalControls = localStorageMiddleware(
	writable<OpenAIControls>(initialValue),
	'open-ai-global-controls'
);
