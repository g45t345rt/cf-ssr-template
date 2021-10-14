import bcrypt from 'bcryptjs'
import { nanoid } from 'nanoid'
import { badResponse, createdResponse, notFoundResponse, okResponse } from 'server/helpers/response'
import { withKV } from 'server/kvprefixes'
import { User } from 'server/kvprefixes/users'

interface RegisterData {
  username: string
  password: string
}

const schema = {
  properties: {
    username: { type: 'string' },
    password: { type: 'string' }
  }
}

export default [
  withKV,
  async (request: Request) => {
    const formData = await request.json()

    //const isValid = ajv.validate(schema, formData)
    //if (!isValid) return new Response(ajv.errors, { status: 400 })

    const { username, password } = formData
    const exists = await request.kv.USERS.getData(username, 'username')
    if (exists) return badResponse(new Error(`Username already exists.`))

    const key = nanoid()
    const salt = await bcrypt.genSalt(10)
    const passwordHash = await bcrypt.hash(password, salt)

    const unix = new Date().getTime() / 1000
    const user = { key, username, passwordHash, createdAt: unix } as User
    await request.kv.USERS.putData(key, user)

    return createdResponse()
  }
]