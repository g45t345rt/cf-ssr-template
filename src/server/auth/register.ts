import bcrypt from 'bcryptjs'
import { nanoid } from 'nanoid'

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

export default async (request: Request) => {
  const formData = await request.json()

  //const isValid = ajv.validate(schema, formData)
  //if (!isValid) return new Response(ajv.errors, { status: 400 })

  const { username, password } = formData
  const exists = await USERNAMES.get(username)
  if (exists) return new Response(`Username already exists.`, { status: 404 })

  const id = nanoid()
  const salt = await bcrypt.genSalt(10)
  const passwordHash = await bcrypt.hash(password, salt)

  const unix = new Date().getTime() / 1000
  const userData = JSON.stringify({ id, username, passwordHash, createdAt: unix })
  await USERNAMES.put(username, id)
  await USERS.put(id, userData)

  return new Response(`User created!`)
}