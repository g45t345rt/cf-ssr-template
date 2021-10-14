import { okResponse } from "server/helpers/response"
import { withKV } from "server/kvprefixes"
import { withUser } from "./user"

export default [
  withKV,
  withUser(),
  async (request: Request) => {
    const { auth } = request
    await request.kv.TOKENS.deleteData(auth.token)
    return okResponse(null, { 'Set-Cookie': `token=${auth.token}; Max-Age=-1; Path=/` })
  }
]
