import cookie from 'cookie'
import { unauthorizedResponse } from 'server/helpers/response'
import { User } from 'server/auth/prefix'

export const getCookieAuthToken = (request: Request): string => {
  const cookieHeader = request.headers.get('cookie')
  if (!cookieHeader) return null
  const cookies = cookie.parse(cookieHeader)
  return cookies['token']
}

export const getUserFromAuthToken = async (env: EnvInterface, authToken: string): Promise<User> => {
  const key = await env.kv.TOKENS.getData(authToken)
  if (!key) return null

  const user = await env.kv.USERS.getData(key)
  return user
}

export const sanitizeUser = (user: User): string => {
  const sanitizedUser = Object.assign({}, user)
  Reflect.deleteProperty(sanitizedUser, 'passwordHash')
  return JSON.stringify(sanitizedUser, null, 2)
}

export const withUser = ({ required = true } = {}) => async (request: Request, env: EnvInterface) => {
  const authToken = await getCookieAuthToken(request)
  if (authToken) {
    const user = await getUserFromAuthToken(env, authToken)
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
