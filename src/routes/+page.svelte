<script>
import { APIKeyStore } from "$lib/APIKeyStore";
import Home from "$lib/Home.svelte";
import Messenger from "$lib/Messenger.svelte";

$: isValidKey = typeof $APIKeyStore === "string" && $APIKeyStore.startsWith('sk-')
</script>

{#if $APIKeyStore !== null && isValidKey}
	<Messenger
		apiKey={$APIKeyStore}
	/>
{:else}
	<Home />
{/if}