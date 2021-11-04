import { badResponse, okResponse } from "server/helpers/response"
import { withKV } from "server/prefixes"
import { getCookieAuthToken, getUserFromAuthToken, sanitizeUser } from "./user"

export default [
  withKV,
  async (request: Request, env: EnvInterface) => {
    const authToken = await getCookieAuthToken(request)
    if (!authToken) return badResponse(new Error(`Missing user "token" in cookie.`))
    const user = await getUserFromAuthToken(env, authToken)
    if (!user) return badResponse(new Error(`Invalid token.`))

    return okResponse(sanitizeUser(user))
  }
]
