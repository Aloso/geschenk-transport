<script lang="ts" generics="T extends string | number | undefined = string">
	interface Props<T extends string | number | undefined> {
		label: string
		label2?: string
		type: T extends string
			? 'text' | 'email' | 'tel' | 'password' | 'textarea'
			: T extends number | undefined
				? 'number'
				: never
		name?: string
		placeholder?: string
		value: T
		required?: string | (() => string | undefined)
		error: string | false
		hasError?: (input: T) => string | false
		submitClicked?: boolean
		style?: string
		smaller?: boolean
	}

	let {
		label,
		label2,
		type,
		name,
		placeholder,
		value = $bindable(),
		required,
		error = $bindable(),
		hasError,
		submitClicked,
		style,
		smaller,
	}: Props<T> = $props()

	let focused = $state(false)
	let customError = $state<string | false>(false)
	let errorVisible = $derived(
		(submitClicked && !!error) || (value !== '' && !focused && !!customError),
	)

	$effect(() => {
		const isRequired = typeof required === 'function' ? required() : required
		if (isRequired && (value === '' || value === undefined)) {
			error = isRequired
		} else if (hasError) {
			error = hasError(value)
			customError = error
		} else {
			error = false
		}
	})
</script>

<label class:smaller>
	<div class="label-text">{label}</div>
	{#if label2}
		<div class="label2-text">{label2}</div>
	{/if}

	{#if type === 'textarea'}
		<textarea
			{name}
			value={value as string}
			{placeholder}
			class="formi"
			class:invalid={errorVisible}
			{style}
			oninput={e => (value = e.currentTarget.value as T)}
			onfocus={() => (focused = true)}
			onblur={() => (focused = false)}
		></textarea>
	{:else if type === 'number'}
		<input
			{type}
			{name}
			{value}
			{placeholder}
			class="formi"
			class:invalid={errorVisible}
			{style}
			oninput={e => (value = e.currentTarget.value as T)}
			onfocus={() => (focused = true)}
			onblur={() => (focused = false)}
		/>
	{:else}
		<input
			{type}
			{name}
			{value}
			{placeholder}
			class="formi"
			class:invalid={errorVisible}
			{style}
			oninput={e => (value = e.currentTarget.value as T)}
			onfocus={() => (focused = true)}
			onblur={() => (focused = false)}
		/>
	{/if}

	{#if error}
		<div class="error" aria-hidden={!errorVisible} class:errorVisible={!!errorVisible}>
			{error}
		</div>
	{/if}
</label>

<style lang="scss">
	label {
		display: block;
		margin: 1.2rem 0;
		&:first-child {
			margin-top: 0;
		}
		&.smaller {
			margin: 0.6rem 0;
		}
	}
	.label-text {
		display: block;
		margin: 0 0 0.5rem;
		font-size: 1.1rem;
		font-weight: 650;

		.smaller & {
			font-size: 0.95rem;
			font-weight: 580;
		}
	}
	.label2-text {
		display: block;
		margin: 0 0 0.5rem;
		font-size: 0.9rem;
		opacity: 0.8;
		line-height: 140%;
	}

	input,
	textarea {
		border: 1.2px solid #de92de;

		&:hover {
			border-color: #d080d0;
		}

		&:focus {
			border-color: #e67ee6;
			outline: 3px solid #e67ee6;
		}
	}

	textarea {
		min-height: var(--min-height, 160px);
	}

	.error {
		display: none;
		font-size: 0.9rem;
		margin: 0.5rem 0 0 0;
		color: #d40000;

		&.errorVisible {
			display: block;
		}
	}
</style>
