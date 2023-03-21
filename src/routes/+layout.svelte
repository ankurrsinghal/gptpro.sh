<script>
	import './styles.css';
</script>

<svelte:head>
	<title>ChatGPT</title>
	<meta name="description" content="A new interface for ChatGPT" />
	<link rel="preconnect" href="https://fonts.googleapis.com">
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous">
	<link href="https://fonts.googleapis.com/css2?family=Overpass:wght@100;200;300;400;500;600&display=swap" rel="stylesheet">
	<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
</svelte:head>

<div class="app">
	<main class="absolute inset-0">
		<slot />
	</main>

	<!-- <footer>
		Created by <a class="underline" href="https://twitter.com/ankurpsinghal">Ankur Singhal</a>
	</footer> -->
</div>

<style>
	
</style>