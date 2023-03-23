import { BotMap } from './Bots';
import type { ChatMessage, OpenAIControls } from './types';

function getSystemPromptFromBotId(botId: string) {
	const bot = BotMap.get(botId);
	if (!bot) {
		throw new Error('Bot not defined!');
	}

	return { role: 'system', content: bot.prompt };
}

export const CheckKey = (key: string) => {
	return fetch('https://api.openai.com/v1/chat/completions', {
		method: 'post',
		body: JSON.stringify({
			model: 'gpt-3.5-turbo-0301',
			messages: [{ role: 'user', content: 'hello' }]
		}),
		headers: {
			Accept: 'application/json',
			Authorization: `Bearer ${key}`,
			'Content-Type': 'application/json'
		}
	});
};

async function fetchWithTimeoutAndRetry(
	input: RequestInfo | URL,
	init?: RequestInit,
	timeout = 10000,
	retryCount = 3
): Promise<Response> {
	try {
		const controller = new AbortController();
		const timeoutId = setTimeout(() => {
			controller.abort();
		}, timeout);
		const response = await fetch(input, { ...init, signal: controller.signal });
		clearTimeout(timeoutId);
		return response;
	} catch (error) {
		if (retryCount > 0) {
			console.error(`Fetch error: ${error}. Retrying in 1 second...`);
			await new Promise((resolve) => setTimeout(resolve, 1000));
			return fetchWithTimeoutAndRetry(input, init, timeout, retryCount - 1);
		}
		throw error;
	}
}

export const ChatCompletion = (
	key: string,
	botId: string,
	messages: ChatMessage[],
	{ model, frequency_penalty, max_tokens, presence_penalty, temperature, top_p }: OpenAIControls
) => {
	return fetchWithTimeoutAndRetry(
		'https://api.openai.com/v1/chat/completions',
		{
			method: 'post',
			body: JSON.stringify({
				model,
				stream: false,
				max_tokens,
				frequency_penalty,
				presence_penalty,
				temperature,
				top_p,
				messages: [getSystemPromptFromBotId(botId)].concat(
					messages.map(({ from, content }) => ({ role: from, content }))
				)
			}),
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${key}`,
				'Content-Type': 'application/json'
			}
		},
		20000,
		2
	).then(async (res) => {
		if (res.status === 401 || !res.ok) {
			let message = 'An error occured on OpenAI. Check network tab.';
			const error = await res.json();
			if (error) {
				if ('error' in error) {
					if (error.error.code === 'invalid_api_key') {
						message = 'Invalid API key provided!';
					} else {
						message = error.error.message;
					}
				}
			}
			throw new Error(message);
		}

		return res.json();
	});
};
