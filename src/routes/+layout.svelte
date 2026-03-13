<script lang="ts">
	import { resolve } from '$app/paths'
	import { page } from '$app/state'
	import Snowflakes from '$lib/components/Snowflakes.svelte'

	import favicon from '$lib/assets/favicon.svg'
	import './global.scss'

	let { children } = $props()
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<a id="logo-link" href={resolve('/')}><img src="/logo.svg" alt="Geschenk Transport" /></a>

<Snowflakes />

<main
	class:admin={page.url.pathname.startsWith('/admin')}
	class:small={page.url.pathname === '/' || page.url.pathname === '/kontakt'}
>
	<nav>
		<a class:active={page.url.pathname === '/'} href={resolve('/')}>Mitmachen</a>
		<a
			class:active={page.url.pathname.startsWith('/unterstuetzen')}
			href={resolve('/unterstuetzen')}>Unterstützen</a
		>
		<a class:active={page.url.pathname.startsWith('/kontakt')} href={resolve('/kontakt')}>Kontakt</a
		>
		<a class:active={page.url.pathname.startsWith('/faq')} href={resolve('/faq')}>Hilfe</a>
	</nav>

	{@render children()}
</main>

<footer>
	<span>Geschenk Trans*port</span>
	<a href={resolve('/datenschutz')}>Datenschutz</a>
	<span>Impressum</span>
	<a href={resolve('/kontakt')}>Kontakt</a>
	<a href={resolve('/faq')}>FAQ</a>
</footer>

<style lang="scss">
	#logo-link {
		display: block;
		margin: 3rem auto 0;
		width: 20rem;
		max-width: 60vw;
		aspect-ratio: 501.413 / 184.322;
		transition: filter 0.2s;

		&:hover,
		&:focus {
			filter: brightness(1.15) drop-shadow(0 0 10px #fff4);
		}
	}

	img {
		width: 20rem;
		max-width: 60vw;
		display: block;
	}

	main {
		max-width: 45rem;
		margin: 0 auto;
		padding: 2rem 2rem 0 2rem;

		&.admin {
			max-width: 70rem;
		}

		&.small {
			max-width: 35rem;
		}
	}

	nav {
		margin: -1rem 0 1rem 0;
		overflow-x: auto;
		white-space: nowrap;
		text-align: center;
		scrollbar-width: thin;

		@media (max-width: 38rem) {
			margin-left: -2rem;
			margin-right: -2rem;
			padding: 0 1rem;
		}

		a {
			display: inline-block;
			background-color: #fffffff2;
			padding: 0.2rem 0.6rem;
			border-radius: 2rem;
			color: #002b89;
			text-decoration: none;
			font-weight: 600;

			&:not(:last-child) {
				margin-right: 0.3rem;
			}

			&.active {
				background-color: #eea8f7;
				color: black;
			}
		}
	}

	footer {
		max-width: 900px;
		margin: 3rem auto;
		padding: 0 2rem;
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
