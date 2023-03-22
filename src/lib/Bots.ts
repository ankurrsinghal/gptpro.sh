import BotsData from './bots.json';
import type { Bot } from './types';

function nameToId(name: string) {
	return name.toLowerCase().split(' ').join('-');
}

export const BotsList: Bot[] = BotsData.map((bot) => ({
	id: nameToId(bot.name),
	name: bot.name,
	prompt: bot.prompt
}));

export const BotMap: Map<string, Bot> = BotsList.reduce((map, bot) => {
	map.set(bot.id, bot);
	return map;
}, new Map());

export function GetBotNameByBotId(botId: string): string {
	return BotMap.get(botId)?.name || 'GPT';
}

export function GetBotById(botId: string) {
	return BotMap.get(botId);
}
