import { okResponse } from "server/helpers/response"
import { withKV } from "server/prefixes"
import { withUser } from "./user"

export default [
  withKV,
  withUser(),
  async (request: Request, env: EnvInterface) => {
    const { auth } = request
    await env.kv.TOKENS.deleteData(auth.token)
    return okResponse(null, { 'Set-Cookie': `token=${auth.token}; Max-Age=-1; Path=/` })
  }
]
