import type { ChatMessage } from "./types";

const System = {
	role: 'system',
	content: `You are a Movies recommendation expert.`
};

export const ChatCompletion = (key: string, messages: ChatMessage[]) => {
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
			messages: [System].concat(messages.map(({ from, content }) => ({ role: from, content })))
		}),
		headers: {
			Accept: 'application/json',
			Authorization: `Bearer ${key}`,
			'Content-Type': 'application/json'
		}
	}).then((res) => res.json());
};
