<script>
	import ApiKeyForm from "./APIKeyForm.svelte";

</script>
<div class="bg-black w-full h-full px-2">
	<div class="container mx-auto">
		<header class="flex h-[80px] items-center justify-between md:h-[100px]">
			<a class="flex items-center justify-center" href="/">
				<img class="w-8 h-8" src="/logo.svg" alt="GPTPro.sh" />
				<h1 class="font-bold text-xl ml-2 text-white">gptpro</h1>
			</a>
			<div class="flex space-x-4">
				<a
					href="https://www.twitter.com/ankurpsinghal"
					class="text-sm flex items-center justify-center space-x-2 rounded-full border border-white text-white  py-2 px-5 shadow-lg transition-all hover:border-slate-400"
					target="_blank"
					rel="noreferrer">Twitter</a
				>
				<a
					href="https://www.github.com/ankurrsinghal"
					class="text-sm flex items-center justify-center space-x-2 rounded-full border border-white text-white  py-2 px-5 shadow-lg transition-all hover:border-slate-400"
					target="_blank"
					rel="noreferrer">Github</a
				>
			</div>
		</header>
	
		<div class="relative mx-auto flex max-w-3xl flex-col justify-center mt-20">
			<div class="max-w-[725px] text-center">
				<h1
					class="before:bg-shine relative mb-8 !text-white/80 before:absolute before:left-0 before:top-0 before:w-full before:animate-[shine_2s_ease-in-out] before:bg-[length:200%] before:bg-clip-text before:text-transparent before:content-['The_next_generation_of_writing_emails']  text-[38px] leading-[46px] md:text-[70px] md:leading-[85px] tracking-[-1.024px;] text-slate-12 font-bold"
				>
					ChatGPT UI with <br /><span
						class="bg-gradient-to-r from-blue-600 via-green-500 to-indigo-400 inline-block text-transparent bg-clip-text"
						>Superpowers</span>
				</h1>
				<h3 class="sm:px-10 text-gray-300 font-light mt-5 text-lg sm:text-xl text-17px md:text-xl tracking-[-0.16px] text-slate-11">
					GPTPro is an open-source ChatGPT interface with ultra-level enhanced features. Use it like
					your daily messenger with thousands of prompts to chat.
				</h3>
			</div>
			<div class="mt-10 flex flex-col items-start">
				<ApiKeyForm />
			</div>
		</div>
	</div>	
</div>