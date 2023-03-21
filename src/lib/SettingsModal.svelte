<script lang="ts">
	import { fade } from "svelte/transition";
	import ApiKeyForm from "./APIKeyForm.svelte";
	import { APIKeyStore } from "./APIKeyStore";
	import CrossIcon from "./icons/CrossIcon.svelte";

  export let onClose: () => void;
</script>
<section class="fixed inset-0 z-20" transition:fade={{ duration: 150 }}>
	<div class="absolute w-full h-full bg-black opacity-75" />
	<div class="absolute inset-4 bg-white rounded-md p-4">
		<button
			on:click={onClose}
			class="absolute right-4 top-4 border border-black  p-1 rounded-full hover:bg-black hover:text-white cursor-pointer"
		>
			<CrossIcon />
		</button>
		<div class="flex items-center justify-center h-full">
      <div class="w-full lg:w-[50%]">
        <ApiKeyForm initialValue={$APIKeyStore} />
      </div>
		</div>
	</div>
</section>
