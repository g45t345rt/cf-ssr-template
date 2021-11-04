import { badResponse, okResponse } from "server/helpers/response"
import { withKV } from "server/prefixes"
import { withUser } from "./user"

interface ChangeUsernameData {
  newUsername: string
}

const schema = {
  properties: {
    newUsername: { type: 'string' }
  }
}

export default [
  withKV,
  withUser(),
  async (request: Request, env: EnvInterface) => {
    const { user } = request.auth
    const formData = await request.json()

    //const isValid = ajv.validate(schema, formData)
    //if (!isValid) return new Response(ajv.errors, { status: 400 })

    const { newUsername } = formData
    if (user.username === newUsername) return badResponse(new Error(`Same username.`))

    const exists = await env.kv.USERS.getData(newUsername, 'username')
    if (exists) return badResponse(new Error(`Username already exists.`))

    user.username = newUsername
    await env.kv.USERS.putData(user.key, user)

    return okResponse()
  }
]
