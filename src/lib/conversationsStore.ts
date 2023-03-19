import { writable } from "svelte/store";
import type { ChatConversation } from "./types";

export function conversationsStore() {
  const store = writable<ChatConversation[]>([]);

  function update(cb: (conversations: ChatConversation[]) => ChatConversation[]) {
    store.update(cb);
  }

  return { subscribe: store.subscribe, update };
}