import cookie from 'cookie'
import { unauthorizedResponse } from 'server/helpers/response'
import { User } from 'server/kvprefixes/users'

export const getCookieAuthToken = (event: FetchEvent): string => {
  const cookieHeader = event.request.headers.get('cookie')
  if (!cookieHeader) return null
  const cookies = cookie.parse(cookieHeader)
  return cookies['token']
}

export const getUserFromAuthToken = async (request: Request, authToken: string): Promise<User> => {
  const key = await request.kv.TOKENS.getData(authToken)
  if (!key) return null

  const user = await request.kv.USERS.getData(key)
  return user
}

export const sanitizeUser = (user: User): string => {
  const sanitizedUser = Object.assign({}, user)
  Reflect.deleteProperty(sanitizedUser, 'passwordHash')
  return JSON.stringify(sanitizedUser, null, 2)
}

export const withUser = ({ required = true } = {}) => async (request: Request, event: FetchEvent) => {
  const authToken = await getCookieAuthToken(event)
  if (authToken) {
    const user = await getUserFromAuthToken(request, authToken)
    if (user) {
      const sanitizedUser = sanitizeUser(user)
      request.auth = {
        sanitizedUser,
        user,
        token: authToken
      }
    }
  }

  if (required && !request.auth) return unauthorizedResponse()
}
