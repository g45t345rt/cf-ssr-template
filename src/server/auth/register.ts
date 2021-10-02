import { Request } from 'itty-router'
import bcrypt from 'bcrypt'

type RegisterData = {
  username: string
  password: string
}

export default async (request: Request) => {
  const data = await request.json() as RegisterData
  const { username, password } = data

  const user = await USERS.get(username)
  if (user) return `Username already exists.`

  const salt = await bcrypt.genSalt(10)
  const passwordHash = await bcrypt.hash(password, salt)

  const userData = JSON.stringify({ username, passwordHash })
  await USERS.put(username, JSON.stringify(userData))
}