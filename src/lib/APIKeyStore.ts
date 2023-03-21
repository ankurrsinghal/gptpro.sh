import { writable } from 'svelte/store';
import { localStorageMiddleware } from './conversationsStore';
import { CheckKey } from './GPT';
import { isClient } from './utils';

let initialAPIKey = null;
if (isClient) {
	try {
		initialAPIKey = localStorage.getItem('apiKey') as string;
	} catch (e) {
		console.warn('Could not read API key from localstorage', e);
	}
}

export const APIKeyStore = localStorageMiddleware(writable<string | null>(initialAPIKey), 'apiKey');

export const SetKeyIfPossible = (key: string) => {
	return CheckKey(key)
		.then(async (res) => {
			if (res.status === 401 || !res.ok) {
				throw new Error('Invalid API Key!');
			}
		})
		.then(() => {
			APIKeyStore.set(key);
		})
};
