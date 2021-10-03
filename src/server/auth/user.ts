import cookie from 'cookie'

export const getCookieUserToken = (event: FetchEvent): string => {
  const cookieHeader = event.request.headers.get('cookie')
  if (!cookieHeader) return null
  const cookies = cookie.parse(cookieHeader)
  return cookies['token']
}

export const getUserFromToken = async (userToken: string) => {
  const id = await TOKENS.get(userToken)
  if (!id) return null

  const user = await USERS.get(id, 'json')
  console.log(user)
  return user
}

export const sanitizeUser = (user: User): string => {
  const sanitizedUser = Object.assign({}, user)
  Reflect.deleteProperty(sanitizedUser, 'passwordHash')
  return JSON.stringify(sanitizedUser)
}

export const currentUser = async (request: Request, event: FetchEvent) => {
  const userToken = await getCookieUserToken(event)
  if (!userToken) return new Response(`Missing user "token" in cookie.`, { status: 400 })
  const user = await getUserFromToken(userToken)
  if (!user) return new Response(`Invalid token.`, { status: 400 })

  return new Response(user)
}

export const logout = async (request: Request) => {
  const { auth } = request
  await TOKENS.delete(auth.token)
  return new Response()
}

export const withUser = async (request: Request, event: FetchEvent) => {
  const userToken = await getCookieUserToken(event)
  console.log(userToken)
  if (userToken) {
    const user = await getUserFromToken(userToken)
    console.log(user)
    if (!user) return

    const sanitizedUser = sanitizeUser(user)
    request.auth = {
      sanitizedUser,
      user,
      token: userToken
    }
  }
}

export const requiredUser = (request: Request) => {
  if (!request.auth) return new Response('Not Authenticated', { status: 401 })
}

