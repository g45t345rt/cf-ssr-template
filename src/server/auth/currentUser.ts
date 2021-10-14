import { badResponse, okResponse } from "server/helpers/response"
import { withKV } from "server/kvprefixes"
import { getCookieAuthToken, getUserFromAuthToken, sanitizeUser } from "./user"

export default [
  withKV,
  async (request: Request, event: FetchEvent) => {
    const authToken = await getCookieAuthToken(event)
    if (!authToken) return badResponse(new Error(`Missing user "token" in cookie.`))
    const user = await getUserFromAuthToken(request, authToken)
    if (!user) return badResponse(new Error(`Invalid token.`))

    return okResponse(sanitizeUser(user))
  }
]
