export interface Registration {
	id: string
	created: number
	name: string
	phone?: string
	email?: string
	address: string
	age: number
	moreInfo?: string
	status: 'pending' | 'verified' | 'deleted'
	notes?: string
}

export interface DbRegistration {
	id: string
	created: number
	name: string
	phone: string | null
	email: string | null
	address: string
	age: number
	moreInfo: string | null
	status: 'pending' | 'verified' | 'deleted'
	notes: string | null
}

export function registrationFromDb(r: DbRegistration): Registration {
	return {
		id: r.id,
		created: r.created,
		name: r.name,
		phone: r.phone ?? undefined,
		email: r.email ?? undefined,
		address: r.address,
		age: r.age,
		moreInfo: r.moreInfo ?? undefined,
		status: r.status,
		notes: r.notes ?? undefined,
	}
}

export function isValidPhoneNumber(num: string): boolean {
	return /^(00\d{1,2}|\+\d{1,2}|0)[\d]{7,16}$/.test(num.replaceAll(/[ .\-()/\\]/g, '').trim())
}

export function isValidEmailAddress(addr: string): boolean {
	return /^\S+@\S+\.\S+$/.test(addr.trim())
}
