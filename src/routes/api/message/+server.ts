import { error, redirect } from '@sveltejs/kit'
import { formDataText } from '$backend/helper'
import { getRegistration } from '$backend/registration'
import { getCookies } from '$lib/cookie'
import type { Registration } from '$lib/data'
import { sendContactEmail } from '$backend/email'
import { resolve } from '$app/paths'

export async function POST({ request, platform }): Promise<never> {
	if (!platform) error(500, 'Platform not available')

	if ((platform.cf?.botManagement.score ?? 100) < 30) {
		error(403, 'Error: bot detected')
	}

	const formData = await request.formData()
	const message = formDataText(formData, 'message') ?? error(400, 'Missing message')
	const contact = (formDataText(formData, 'contact') ?? error(400, 'Missing contact')).trim()

	const { 'registration-id': id } = getCookies(request.headers)
	let registration: Registration | undefined
	try {
		registration = await getRegistration(id, platform.env)
	} catch {
		// do nothing
	}

	await sendContactEmail(platform.env, contact, message, registration)

	return redirect(303, resolve('/kontakt/abgesendet'))
}
