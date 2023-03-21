import { BotMap } from './Bots';
import type { ChatMessage } from './types';

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

export const ChatCompletion = (key: string, botId: string, messages: ChatMessage[]) => {
	return fetch('https://api.openai.com/v1/chat/completions', {
		method: 'post',
		body: JSON.stringify({
			model: 'gpt-3.5-turbo-0301',
			stream: false,
			max_tokens: 256,
			frequency_penalty: 0,
			presence_penalty: 0,
			temperature: 0.7,
			top_p: 1,
			messages: [getSystemPromptFromBotId(botId)].concat(
				messages.map(({ from, content }) => ({ role: from, content }))
			)
		}),
		headers: {
			Accept: 'application/json',
			Authorization: `Bearer ${key}`,
			'Content-Type': 'application/json'
		}
	}).then(async (res) => {
		if (res.status === 401 || !res.ok) {
			throw new Error('Invalid API Key!');
		}

		return res.json();
	});
};
