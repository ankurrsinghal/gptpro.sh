<script lang="ts">
import type { ChatConversation } from "$lib/types";

export let conversation: ChatConversation;
export let handleConversationClick: (conversation: ChatConversation) => void;
export let isSelected: boolean;

$: console.log("isSelected", isSelected);

</script>

<div
  on:click={() => handleConversationClick(conversation)}
  class="p-4 border-b border-black hover:bg-slate-100 cursor-pointer transition-colors { isSelected ? 'bg-slate-100' : 'bg-white' }"
  aria-hidden
>
  <div class="text-md mb-1">{conversation.title}</div>
  <div class="text-sm">{conversation.subTitle}</div>
</div>