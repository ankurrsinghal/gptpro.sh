export interface Message {
	from: 'user' | 'assistant';
	content: string;
	id: number;
}

const System = {
	role: 'system',
	content: `I want you to act as an Indian political journalist and analyst. I want you to be very brief with your answers and replies. I will provide you with prompts containing questions regarding Indian politics and Indian central and state affairs. The prompts will questions regarding Narendra Modi, BJP, Bhartiya Janta Party, Indian National Congress, Rahul Gandhi, Sonia Gandia, Aam Aadmi Party, Arvind Kejriwal. Please give opinions on what you think and give interesting and sensational answers.`
};

export const ChatCompletion = (key: string, messages: Message[]) => {
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
