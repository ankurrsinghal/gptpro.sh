<script lang="ts">
	import { onMount } from 'svelte';
	import ApiKeyForm from './APIKeyForm.svelte';
	import TwitterIcon from './icons/TwitterIcon.svelte';
	import Loader from './Loader.svelte';
	import LoaderSpin from './LoaderSpin.svelte';

	export let onDone: () => void;

	let isLoading = true;

	onMount(() => {
		setTimeout(() => {
			isLoading = false;
			onDone();
		}, 1500);
	});
</script>

<div class="w-full h-full p-4">
	<div class="container mx-auto">
		<header class="flex items-center justify-between md:h-[80px]">
			<a class="flex items-center justify-center" href="/">
				<img class="w-8 h-8" src="/logo.svg" alt="GPTPro.sh" />
				<h1 class="text-2xl ml-2 text-black font-extrabold">gptpro</h1>
			</a>
			<div class="flex">
				<a
					href="https://www.twitter.com/ankurpsinghal"
					class="text-sm flex items-center justify-center rounded-full bg-[#1D9BF0] text-white py-2 px-3 md:py-2 md:px-5 shadow-lg transition-all hover:bg-[#1A8CD8]"
					target="_blank"
					rel="noreferrer"
				>
					<div class="flex mr-2 w-5 h-5"><TwitterIcon /></div>
					@ankurpsinghal</a
				>
				<!-- <a
					href="https://www.github.com/ankurrsinghal"
					class="text-sm flex items-center justify-center space-x-2 rounded-full border border-gray-300 bg-white py-2 px-3 md:py-2 md:px-5 shadow-lg transition-all hover:border-gray-800"
					target="_blank"
					rel="noreferrer">Github</a
				> -->
			</div>
		</header>

		<div class="relative mx-auto flex max-w-3xl flex-col justify-center mt-20">
			<div class="max-w-[725px] text-center">
				<h1
					class="before:bg-shine relative mb-8 before:absolute before:left-0 before:top-0 before:w-full before:animate-[shine_2s_ease-in-out] before:bg-[length:200%] before:bg-clip-text before:text-transparent before:content-['chatgpt_ui_with_superpowers'] text-[45px] leading-[50px] md:text-[70px] md:leading-[85px] tracking-[-1.024px;] text-slate-12 font-extrabold"
				>
					ChatGPT UI with <br /><span
						class="bg-gradient-to-r from-blue-600 via-green-500 to-indigo-400 inline-block text-transparent bg-clip-text"
						>Superpowers</span
					>
				</h1>
				<h3
					class="sm:px-10 text-gray-900 font-normal mt-5 text-lg sm:text-xl text-17px md:text-xl tracking-[-0.16px] text-slate-11"
				>
					GPTPro is a <span class="text-black font-bold">free</span> ChatGPT interface with ultra-level
					enhanced features. Use it like your daily messenger with thousands of prompts to chat.
				</h3>
			</div>
			<div class="mt-10 flex flex-col items-start">
				{#if !isLoading}
					<ApiKeyForm />
				{:else}
					<div class="mx-auto flex items-center flex-col">
						<p class="text-center mb-4 text-sm text-black font-bold">Checking your key...</p>
						<LoaderSpin size={30} />
					</div>
				{/if}
			</div>
		</div>
	</div>
	<div class="bg fixed inset-0" />
	<div class="fixed bottom-0 bg-white text-center p-2 left-0 text-black text-sm w-full">
		Work in Progress, please report your issues <a
			class="underline"
			href="https://github.com/ankurrsinghal/gptpro.sh/issues"
			target="_blank"
			rel="noreferrer">here</a
		>.
	</div>
</div>

<style>
	.bg {
		/* From https://css.glass */
		background-image: radial-gradient(
			circle farthest-corner at 10% 20%,
			rgba(255, 94, 247, 1) 17.8%,
			rgba(2, 245, 255, 1) 100.2%
		);

		padding: 2rem;
		opacity: 0.1;
		z-index: -1;
	}
</style>
