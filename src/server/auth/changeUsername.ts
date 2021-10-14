import { badResponse, notFoundResponse, okResponse } from "server/helpers/response"
import { withKV } from "server/kvprefixes"
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
  async (request: Request) => {
    const { user } = request.auth
    const formData = await request.json()

    //const isValid = ajv.validate(schema, formData)
    //if (!isValid) return new Response(ajv.errors, { status: 400 })

    const { newUsername } = formData
    if (user.username === newUsername) return badResponse(new Error(`Same username.`))

    const exists = await request.kv.USERS.getData(newUsername, 'username')
    if (!exists) return notFoundResponse(new Error(`Username already exists.`))

    user.username = newUsername
    await request.kv.USERS.putData(user.key, user)

    return okResponse()
  }
]
