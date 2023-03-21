<script>
	import ApiKeyForm from './APIKeyForm.svelte';
</script>

<div class="w-full h-full px-2">
	<div class="container mx-auto">
		<header class="flex h-[80px] items-center justify-between md:h-[100px]">
			<a class="flex items-center justify-center" href="/">
				<img class="w-8 h-8" src="/logo.svg" alt="GPTPro.sh" />
				<h1 class="text-2xl ml-2 text-black font-extrabold">gptpro</h1>
			</a>
			<div class="flex space-x-4">
				<a
					href="https://www.twitter.com/ankurpsinghal"
					class="text-sm flex items-center justify-center space-x-2 rounded-full border border-gray-300 bg-white py-2 px-5 shadow-lg transition-all hover:border-gray-800"
					target="_blank"
					rel="noreferrer">Twitter</a
				>
				<a
					href="https://www.github.com/ankurrsinghal"
					class="text-sm flex items-center justify-center space-x-2 rounded-full border border-gray-300 bg-white py-2 px-5 shadow-lg transition-all hover:border-gray-800"
					target="_blank"
					rel="noreferrer">Github</a
				>
			</div>
		</header>

		<div class="relative mx-auto flex max-w-3xl flex-col justify-center mt-20">
			<div class="max-w-[725px] text-center">
				<h1
					class="before:bg-shine relative mb-8 before:absolute before:left-0 before:top-0 before:w-full before:animate-[shine_2s_ease-in-out] before:bg-[length:200%] before:bg-clip-text before:text-transparent before:content-['chatgpt_ui_with_superpowers'] text-[38px] leading-[46px] md:text-[70px] md:leading-[85px] tracking-[-1.024px;] text-slate-12 font-extrabold"
				>
					ChatGPT UI with <br /><span
						class="bg-gradient-to-r from-blue-600 via-green-500 to-indigo-400 inline-block text-transparent bg-clip-text"
						>Superpowers</span
					>
				</h1>
				<h3
					class="sm:px-10 text-gray-900 font-light mt-5 text-lg sm:text-xl text-17px md:text-xl tracking-[-0.16px] text-slate-11"
				>
					GPTPro is an open-source ChatGPT interface with ultra-level enhanced features. Use it like
					your daily messenger with thousands of prompts to chat.
				</h3>
			</div>
			<div class="mt-10 flex flex-col items-start">
				<ApiKeyForm />
			</div>
		</div>
	</div>
	<div class="colorful">
		<div class="colorful-bg" />
	</div>
</div>

<style>
	.colorful {
		width: 100vw;
		min-height: 100vh;
		position: fixed;
		display: flex;
		justify-content: center;
		padding: 120px 24px 160px;
		pointer-events: none;
		top: 0;
		left: 0;
		z-index: -1;
	}

	.colorful::before {
		background: radial-gradient(circle, rgba(2, 0, 36, 0) 0, #fafafa 100%);
		position: absolute;
		content: '';
		z-index: 2;
		width: 100%;
		height: 100%;
		top: 0;
	}

	.colorful::after {
		content: '';
		background-image: url(/_static/grid.svg);
		z-index: 1;
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0;
		opacity: 0.4;
		filter: invert(1);
	}

	.colorful-bg {
		z-index: 3;
		max-width: 640px;
		background-image: radial-gradient(at 27% 37%, #3a8bfd 0, transparent 0),
			radial-gradient(at 97% 21%, #72fe8e 0, transparent 50%),
			radial-gradient(at 52% 99%, #fd4b4e 0, transparent 50%),
			radial-gradient(at 10% 29%, #855afc 0, transparent 50%),
			radial-gradient(at 97% 96%, #e4c795 0, transparent 50%),
			radial-gradient(at 33% 50%, #8ca8e8 0, transparent 50%),
			radial-gradient(at 79% 53%, #eea5ba 0, transparent 50%);
		position: absolute;
		content: '';
		width: 100%;
		height: 100%;
		filter: blur(100px) saturate(150%);
		top: 80px;
		opacity: 0.15;
	}
</style>
