<script>
	import './styles.css';
</script>

<svelte:head>
	<title>ChatGPT</title>
	<meta name="description" content="A new interface for ChatGPT" />
	<link rel="preconnect" href="https://fonts.googleapis.com">
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous">
	<link href="https://fonts.googleapis.com/css2?family=Overpass:wght@100;200;300;400;500;600&display=swap" rel="stylesheet">
</svelte:head>

<div class="app">
	<main>
		<slot />
	</main>

	<!-- <footer>
		Created by <a class="underline" href="https://twitter.com/ankurpsinghal">Ankur Singhal</a>
	</footer> -->
</div>

<style>
	
</style>