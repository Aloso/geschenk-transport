<script lang="ts">
	import { page } from '$app/state'

	// import favicon from '$lib/assets/favicon.svg';
	import './global.scss'

	let { children } = $props()
</script>

<svelte:head>
	<!-- <link rel="icon" href={favicon} /> -->
</svelte:head>

<main class:admin={page.url.pathname.startsWith('/admin')}>
	{@render children()}
</main>

<footer>
	<span>Trans* Santa Kassel</span>
	<a href="/">Startseite</a>
	<a href="/datenschutz">Datenschutz</a>
	<span>Impressum</span>
	<a href="/kontakt">Kontakt</a>
	<a href="/faq">FAQ</a>
</footer>

<style lang="scss">
	main {
		max-width: 900px;
		margin: 0 auto;
		padding: 2rem;

		&.admin {
			max-width: 1400px;
		}
	}

	footer {
		max-width: 900px;
		margin: 2rem auto;
		padding: 0 2rem;
		color: #fffc;
		font-size: 0.9rem;
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 1rem 2rem;

		a {
			text-decoration: none;

			&:hover,
			&:focus {
				text-decoration: underline;
				text-underline-offset: 4px;
				text-decoration-thickness: 1.4px;
			}
		}
	}
</style>
