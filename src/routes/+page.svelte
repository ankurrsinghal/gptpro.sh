<script>
import { APIKeyStore } from "$lib/APIKeyStore";
import Messenger from "$lib/Messenger.svelte";

const apiKey = APIKeyStore();

$: console.log($apiKey);
</script>

{#if $apiKey !== null}
	<Messenger
		apiKey={$apiKey}
	/>
{/if}