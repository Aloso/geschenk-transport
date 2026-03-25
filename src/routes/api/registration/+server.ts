import { error } from '@sveltejs/kit'
import { v4 } from 'uuid'
import { dev } from '$app/environment'
import { resolve } from '$app/paths'
import { formDataText } from '$backend/helper'
import { addRegistration, getRegistrationsCount, deleteRegistration } from '$backend/registration'
import { validateRegistration } from '$backend/validate'
import { sendRegistrationEmail } from '$backend/email'
import { getCookies } from '$lib/cookie'

export async function POST({ request, platform, getClientAddress }): Promise<Response> {
	if (!platform) error(500, 'Platform not available')

	if ((platform.cf?.botManagement.score ?? 100) < 30) {
		error(403, 'Error: bot detected')
	}

	const formData = await request.formData()
	const name = formDataText(formData, 'name') ?? error(400, 'Missing name')
	const age = +(formDataText(formData, 'age') ?? error(400, 'Missing age'))
	const address = formDataText(formData, 'address') ?? error(400, 'Missing address')
	const phone = formDataText(formData, 'phone')
	const email = formDataText(formData, 'email')
	const moreInfo = formDataText(formData, 'moreInfo')

	if (!dev) {
		const turnstile =
			formDataText(formData, 'cf-turnstile-response') ?? error(400, 'Captcha not solved')
		await verifyCaptcha(turnstile, getClientAddress(), platform)
	}

	const count = await getRegistrationsCount(platform.env)
	if (count >= Number(platform.env.SUBMISSIONS_LIMIT)) {
		error(400, 'Submissions limit exceeded')
	}

	const registration = {
		id: v4(),
		created: Date.now(),
		name,
		phone,
		email,
		address,
		age,
		moreInfo,
		status: 'pending' as const,
	}
	validateRegistration(registration)
	await addRegistration(platform.env, registration)

	if (!dev) {
		await sendRegistrationEmail(platform.env, registration)
	}

	return new Response('Sie werden weitergeleitet...', {
		status: 303,
		headers: {
			Location: resolve('/angemeldet'),
			'Set-Cookie': `registration-id=${registration.id}; Max-Age=${365 * 24 * 60 * 60}; Path=/; SameSite=Strict`,
		},
	})
}

export async function DELETE({ request, platform }): Promise<Response> {
	if (!platform) error(500, 'Platform not available')

	const { 'registration-id': id } = getCookies(request.headers)
	if (!id) error(400, 'Missing id')

	await deleteRegistration(platform.env, id)

	return new Response('Sie werden weitergeleitet...', {
		status: 303,
		headers: {
			Location: resolve('/'),
			'Set-Cookie': `registration-id=${id}; Max-Age=0; Path=/; SameSite=Strict`,
		},
	})
}

async function verifyCaptcha(token: string, ip: string, platform: App.Platform) {
	const formData = new FormData()
	formData.append('secret', platform.env.TURNSTILE_SECRET_KEY)
	formData.append('response', token)
	formData.append('remoteip', ip)

	const result = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
		body: formData,
		method: 'POST',
	})
	const outcome = await result.json()

	if (!outcome.success) {
		error(403, 'Turnstile captcha verification failed')
	}
}
