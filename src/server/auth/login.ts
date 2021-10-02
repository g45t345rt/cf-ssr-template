import { Request } from 'itty-router'
import bcrypt from 'bcrypt'

type LoginData = {
  username: string
  password: string
}

export default async (request: Request) => {
  const data = await request.json() as LoginData
  const { username, password } = data

  const user = await USERS.get(username)
  if (!user) return `User does not exists.`

  const validPassword = await bcrypt.compare(password, user.passwordHash)
  if (!validPassword) return `Invalid password.`

  return
}