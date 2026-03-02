/**
 * @module
 * Cookie utility.
 */

export type Cookie = Record<string, string>

type PartitionedCookieConstraint =
	| { partitioned: true; secure: true }
	| { partitioned?: boolean; secure?: boolean } // reset to default

export type CookieOptions = {
	domain?: string
	expires?: Date
	httpOnly?: boolean
	maxAge?: number
	path?: string
	secure?: boolean
	sameSite?: 'Strict' | 'Lax' | 'None' | 'strict' | 'lax' | 'none'
	partitioned?: boolean
	priority?: 'Low' | 'Medium' | 'High' | 'low' | 'medium' | 'high'
	prefix?: CookiePrefixOptions
} & PartitionedCookieConstraint
export type CookiePrefixOptions = 'host' | 'secure'

// all alphanumeric chars and all of _!#$%&'*.^`|~+-
// (see: https://datatracker.ietf.org/doc/html/rfc6265#section-4.1.1)
const validCookieNameRegEx = /^[\w!#$%&'*.^`|~+-]+$/

// all ASCII chars 32-126 except 34, 59, and 92 (i.e. space to tilde but not double quote, semicolon, or backslash)
// (see: https://datatracker.ietf.org/doc/html/rfc6265#section-4.1.1)
//
// note: the spec also prohibits comma and space, but we allow both since they are very common in the real world
// (see: https://github.com/golang/go/issues/7243)
const validCookieValueRegEx = /^[ !#-:<-[\]-~]*$/

export const parseCookies = (cookie: string, name?: string): Cookie => {
	if (name && cookie.indexOf(name) === -1) {
		// Fast-path: return immediately if the demanded-key is not in the cookie string
		return {}
	}
	const pairs = cookie.trim().split(';')
	const parsedCookie: Cookie = {}
	for (let pairStr of pairs) {
		pairStr = pairStr.trim()
		const valueStartPos = pairStr.indexOf('=')
		if (valueStartPos === -1) {
			continue
		}

		const cookieName = pairStr.substring(0, valueStartPos).trim()
		if ((name && name !== cookieName) || !validCookieNameRegEx.test(cookieName)) {
			continue
		}

		let cookieValue = pairStr.substring(valueStartPos + 1).trim()
		if (cookieValue.startsWith('"') && cookieValue.endsWith('"')) {
			cookieValue = cookieValue.slice(1, -1)
		}
		if (validCookieValueRegEx.test(cookieValue)) {
			parsedCookie[cookieName] =
				cookieValue.indexOf('%') !== -1 ? decodeURIComponent(cookieValue) : cookieValue
			if (name) {
				// Fast-path: return only the demanded-key immediately. Other keys are not needed.
				break
			}
		}
	}
	return parsedCookie
}

export function getCookies(headers: Headers): Cookie {
	const cookie = headers.get('cookie')
	return cookie == null ? {} : parseCookies(cookie)
}
