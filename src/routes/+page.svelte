<script>
	import { APIKeyStore } from '$lib/APIKeyStore';
	import Home from '$lib/Home.svelte';
	import Messenger from '$lib/Messenger.svelte';
	import { onMount } from 'svelte';

	$: isValidKey = typeof $APIKeyStore === 'string' && $APIKeyStore.startsWith('sk-');

	let isLoading = true;

	function onDone() {
		isLoading = false;
	}
</script>

{#if !isLoading && $APIKeyStore !== null && isValidKey}
	<Messenger apiKey={$APIKeyStore} />
{:else}
	<Home {onDone} />
{/if}
