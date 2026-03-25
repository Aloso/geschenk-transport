import { error } from '@sveltejs/kit'
import type { Registration } from '$lib/data.js'
import { getCookies } from '$lib/cookie.js'
import { getRegistration, getRegistrationsCount } from '$backend/registration'

export interface PageData {
	registration?: Registration
	error?: 'not-found' | 'limit-exceeded' | 'other'
}

export async function load({ platform, request }): Promise<PageData> {
	if (!platform) error(500, 'Platform not available')

	const { 'registration-id': id } = getCookies(request.headers)
	if (!id) {
		const count = await getRegistrationsCount(platform.env)
		if (count >= Number(platform.env.SUBMISSIONS_LIMIT)) {
			return { error: 'limit-exceeded' }
		}

		return {}
	}

	try {
		const registration = await getRegistration(id, platform.env)
		return registration ? { registration } : { error: 'not-found' }
	} catch {
		return { error: 'other' }
	}
}
