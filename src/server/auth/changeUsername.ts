import { Request } from 'itty-router'

interface ChangeUsernameData {
  newUsername: string
}

const schema = {
  properties: {
    newUsername: { type: 'string' }
  }
}

export default async (request: Request) => {
  const { username, id } = request.user
  const formData = await request.json()

  //const isValid = ajv.validate(schema, formData)
  //if (!isValid) return new Response(ajv.errors, { status: 400 })

  const { newUsername } = formData

  const exists = await USERNAMES.get(newUsername)
  if (exists) return new Response(`Username already exists.`, { status: 404 })

  await USERNAMES.delete(username)
  await USERNAMES.put(newUsername, id)
  await USERS.put(id, { ...request.user, username: newUsername })
  return new Response(`Username was changed!`)
}
