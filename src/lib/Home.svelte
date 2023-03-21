<script>
	import ApiKeyForm from "./APIKeyForm.svelte";

</script>
<div class="container mx-auto">
	<header class="w-full flex h-16 items-center justify-between px-4">
		<a class="flex items-center justify-center" href="/">
			<img class="w-8 h-8" src="/logo.svg" alt="GPTPro.sh" />
			<h1 class="font-bold text-xl ml-2">GPTPro</h1>
		</a>
		<div class="flex space-x-4">
			<a
				href="https://www.twitter.com/ankurpsinghal"
				class="flex items-center justify-center space-x-2 rounded-full border border-gray-300 bg-white py-2 px-5 shadow-lg transition-all hover:border-gray-800"
				target="_blank"
				rel="noreferrer">Twitter</a
			>
			<a
				href="https://www.github.com/ankurrsinghal"
				class="flex items-center justify-center space-x-2 rounded-full border border-gray-300 bg-white py-2 px-5 shadow-lg transition-all hover:border-gray-800"
				target="_blank"
				rel="noreferrer">Github</a
			>
		</div>
	</header>

	<div class="mx-auto mt-20 mb-10 max-w-md px-2.5 text-center sm:max-w-lg sm:px-0">
		<h1
			class="mt-5 font-display text-5xl font-extrabold leading-[1.15] text-black sm:text-6xl sm:leading-[1.15]"
		>
			ChatGPT UI with <br /><span
				class="bg-gradient-to-r from-amber-500 via-orange-600 to-yellow-500 bg-clip-text text-transparent"
				>Superpowers</span
			>
		</h1>
		<h3 class="mt-5 text-lg text-gray-600 sm:text-xl">
			GPTPro is an open-source ChatGPT interface with ultra-level enhanced features. Use it like
			your daily messenger with thousands of prompts to chat.
		</h3>
		<div class="mt-10 flex flex-col items-start">
			<ApiKeyForm />
		</div>
	</div>
</div>
