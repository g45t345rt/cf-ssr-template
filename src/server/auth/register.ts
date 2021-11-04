import bcrypt from 'bcryptjs'
import { nanoid } from 'nanoid'
import { badResponse, createdResponse } from 'server/helpers/response'
import { withKV } from 'server/prefixes'
import { User } from 'server/auth/prefix'
import { useValueLock } from 'valueLock'

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
  async (request: Request, env: EnvInterface) => {
    const formData = await request.json()

    //const isValid = ajv.validate(schema, formData)
    //if (!isValid) return new Response(ajv.errors, { status: 400 })

    const { username, password } = formData
    let exists = await env.kv.USERS.getData(username, 'username')
    if (exists) return badResponse(new Error(`Username already exists.`))

    const valueLock = useValueLock(env, 'usernames')
    const isUsernameLock = await valueLock.exists(username)
    if (isUsernameLock) return badResponse(new Error(`Username locked.`))

    // lock username in case someone register at the sametime with the same username
    await valueLock.lock(username)

    const key = nanoid()
    const salt = await bcrypt.genSalt(10)
    const passwordHash = await bcrypt.hash(password, salt)

    const unix = new Date().getTime() / 1000
    const user = { key, username, passwordHash, createdAt: unix } as User
    await env.kv.USERS.putData(key, user)

    return createdResponse()
  }
]