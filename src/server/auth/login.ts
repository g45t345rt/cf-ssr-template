import bcrypt from 'bcryptjs'
import { nanoid } from 'nanoid'
import { badResponse, jsonOkResponse, notFoundResponse, okResponse } from 'server/helpers/response'
import { withKV } from 'server/prefixes'
import ZSchema from 'z-schema'

import { sanitizeUser } from './user'

const validator = new ZSchema({})

interface LoginData {
  username: string
  password: string
}

const schema = {
  type: 'object',
  properties: {
    username: { type: 'string' },
    password: { type: 'string' }
  },
  required: ["username", "password"]
}


export default [
  withKV,
  async (request: Request, env: EnvInterface) => {
    const { auth } = request
    if (auth) return new Response(auth.sanitizedUser)

    const formData = await request.json()

    const isValid = validator.validate(formData, schema)
    var error = validator.getLastError()
    //if (!isValid) return new Response(error, { status: 400 })

    const { username, password } = formData
    console.log(formData)
    const user = await env.kv.USERS.getData(username, 'username')
    if (!user) return notFoundResponse(new Error(`User does not exists.`))

    const validPassword = await bcrypt.compare(password, user.passwordHash)
    if (!validPassword) return badResponse(new Error(`Invalid password.`))

    const newToken = nanoid()
    const ttl = 60 * 60 * 4 // 4 hours
    await env.kv.TOKENS.putData(newToken, user.key, { expirationTtl: ttl })
    
    return okResponse(sanitizeUser(user), { 'Set-Cookie': `token=${newToken}; Max-Age=${ttl}; Path=/` })
  }
]
