import bcrypt from 'bcryptjs'

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

export default async (request: Request) => {
  const { user } = request
  const formData = await request.json()

  //const isValid = ajv.validate(schema, formData)
  //if (!isValid) return new Response(ajv.errors, { status: 400 })

  const { oldPassword, newPassword } = formData

  const validPassword = await bcrypt.compare(oldPassword, user.passwordHash)
  if (!validPassword) return new Response(null, { status: 400 })

  const salt = await bcrypt.genSalt(10)
  const newPasswordHash = await bcrypt.hash(newPassword, salt)
  user.passwordHash = newPasswordHash
  await USERS.put(username, user)

  return new Response(`Password changed!`)
}