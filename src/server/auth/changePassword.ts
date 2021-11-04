import bcrypt from 'bcryptjs'
import { withKV } from 'server/prefixes'
import { withUser } from './user'

interface ChangePasswordData {
  oldPassword: string
  newPassword: string
}

const schema = {
  properties: {
    oldPassword: { type: 'string' },
    newPassword: { type: 'string' }
  }
}

export default [
  withKV,
  withUser(),
  async (request: Request, env: EnvInterface) => {
    const { auth } = request
    const { user } = auth
    const formData = await request.json()

    //const isValid = ajv.validate(schema, formData)
    //if (!isValid) return new Response(ajv.errors, { status: 400 })

    const { oldPassword, newPassword } = formData

    const validPassword = await bcrypt.compare(oldPassword, user.passwordHash)
    if (!validPassword) return new Response(null, { status: 400 })

    const salt = await bcrypt.genSalt(10)
    const newPasswordHash = await bcrypt.hash(newPassword, salt)
    user.passwordHash = newPasswordHash
    await env.kv.USERS.putData(auth.user.key, user)

    return new Response(`Password changed!`)
  }
]