import bcrypt from 'bcryptjs'
import { nanoid } from 'nanoid'
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


export default async (request: Request) => {
  const { auth } = request
  if (auth) return new Response(auth.sanitizedUser)

  const formData = await request.json()

  const isValid = validator.validate(formData, schema)
  var error = validator.getLastError()
  if (!isValid) return new Response(error, { status: 400 })

  const { username, password } = formData
  console.log(formData)
  const id = await USERNAMES.get(username)
  if (!id) return new Response(`User does not exists.`, { status: 404 })

  const user = await USERS.get(id, 'json')
  const validPassword = await bcrypt.compare(password, user.passwordHash)
  if (!validPassword) return new Response(`Invalid password.`, { status: 400 })

  const newToken = nanoid()
  const ttl = 60 * 60 * 4 // 4 hours
  await TOKENS.put(`${newToken}`, id, { expirationTtl: ttl })

  const init = {
    headers: {
      'Content-Type': 'application/json',
      'Set-Cookie': `token=${newToken}; Max-Age=${ttl}; Path=/`
    }
  } as ResponseInit

  return new Response(sanitizeUser(user), init)
}