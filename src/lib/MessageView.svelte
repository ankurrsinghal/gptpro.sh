<script lang="ts">
	import type { ChatMessage } from '$lib/types';

	export let message: ChatMessage;
</script>

<div
	class={[
		'relative',
		'max-w-[85%] lg:max-w-[60%]',
		'whitespace-pre-wrap',
		'px-3 py-2',
		'rounded-md',
		'shadow-md',
		'shadow-gray-100',
		'leading-relaxed',
		'border border-[var(--border-color)]',
		'text-sm',
		'font-normal',
		message.from === 'user' ? 'bg-gray-100 text-black ml-auto' : 'bg-white mr-auto text-black'
	].join(' ')}
>
	{message.content}
</div>
