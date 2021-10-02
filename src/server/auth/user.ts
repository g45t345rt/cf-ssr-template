import { Request } from 'itty-router'
import cookie from 'cookie'

export interface User {
  id: string
  username: string
  passwordHash: string
  createdAt: number
}

export const withUser = async (request: Request, event: FetchEvent) => {
  const cookieHeader = event.request.headers.get('cookie')
  const cookies = cookie.parse(cookieHeader)
  const cookieToken = cookies['token']

  if (!cookieToken) return

  const id = await TOKENS.get(cookieToken)
  if (!id) return

  const user = await USERS.get(id, 'json')
  request.user = user
}

export const requiredUser = (request: Request) => {
  if (!request.user) {
    return new Response('Not Authenticated', { status: 401 })
  }
}
