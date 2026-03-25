import { isValidEmailAddress, isValidPhoneNumber, type Registration } from '$lib/data'
import { error } from '@sveltejs/kit'

export function validateRegistration(registration: Omit<Registration, 'status'>) {
	const { phone, email, name, age, address } = registration

	if (!phone && !email) error(400, 'Missing phone number or email address')

	if (name === '') error(400, 'Invalid name')

	if (Number.isNaN(age) || age < 12) error(400, 'Invalid age')

	const addressLines = address.split(/[\n,]/)
	if (addressLines.length < 2 || addressLines.some(line => line.length <= 5))
		error(400, 'Invalid address')

	if (phone && !isValidPhoneNumber(phone)) error(400, 'Invalid phone number')

	if (email && !isValidEmailAddress(email)) error(400, 'Invalid email address')
}
