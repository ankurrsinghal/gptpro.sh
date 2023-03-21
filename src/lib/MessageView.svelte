<script lang="ts">
import type { ChatMessage } from "$lib/types";

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
		'leading-relaxed',
		'border border-gray-300',
		message.from === 'user' ? 'bg-cyan-100 text-black ml-auto' : 'bg-white mr-auto text-black'
	].join(' ')}
>
	{message.content}
</div>
