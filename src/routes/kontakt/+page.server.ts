import { error } from '@sveltejs/kit'
import type { Registration } from '$lib/data.js'
import { getCookies } from '$lib/cookie.js'
import { getRegistration } from '../../backend/registration.js'

export interface PageData {
	registration?: Registration
	error?: 'not-found' | 'other'
}

export async function load({ platform, request }): Promise<PageData> {
	if (!platform) error(500, 'Platform not available')

	const { 'registration-id': id } = getCookies(request.headers)
	if (!id) return {}

	try {
		const registration = await getRegistration(id, platform.env)
		return registration ? { registration } : { error: 'not-found' }
	} catch {
		return { error: 'other' }
	}
}
